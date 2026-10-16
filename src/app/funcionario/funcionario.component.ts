import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat">
      <h2>Canal anônimo</h2>
      <p class="aviso">
        Sua identidade não é registrada. Use sempre este navegador: ao limpar os dados,
        você perde o acesso às respostas.
      </p>

      <div class="msgs">
        <div *ngFor="let m of msgs" [class]="'msg ' + m.sender_role">{{ m.body }}</div>
      </div>

      <textarea [(ngModel)]="texto" maxlength="2000"
                placeholder="Escreva sua mensagem"></textarea>
      <button (click)="enviar()" [disabled]="!texto.trim()">Enviar</button>
    </div>
  `,
  styles: [`
    :host { display: block; color: #f5f5f5; }
    .chat { max-width: 600px; margin: 2rem auto; padding: 0 1rem;
            display: flex; flex-direction: column; gap: .75rem; }
    .aviso { font-size: .85rem; color: #aaa; }
    .msgs { display: flex; flex-direction: column; gap: .5rem; min-height: 200px; }
    .msg { padding: .6rem .9rem; border-radius: 12px; max-width: 80%; color: #111; }
    .employee { background: #bfdbfe; align-self: flex-end; }
    .admin { background: #e5e7eb; align-self: flex-start; }
    textarea { min-height: 80px; padding: .5rem; border-radius: 8px; }
    button { padding: .6rem; border-radius: 8px; cursor: pointer; }
  `]
})
export class FuncionarioComponent implements OnInit, OnDestroy {
  msgs: any[] = [];
  texto = '';
  threadId?: string;
  canal: any;

  constructor(private sb: SupabaseService) { }

  async ngOnInit() {
    if (!this.sb.isBrowser) return;
    await this.sb.garantirSessaoAnonima();
    this.threadId = await this.sb.minhaThread();
    if (this.threadId) {
      await this.carregar();
      this.assinar();
    }
  }

  async carregar() {
    this.msgs = await this.sb.mensagens(this.threadId!);
  }

  assinar() {
    this.canal = this.sb.client.channel('func-' + this.threadId)
      .on('postgres_changes',
        {
          event: '*', schema: 'public', table: 'messages',
          filter: `thread_id=eq.${this.threadId}`
        },
        () => this.carregar())
      .subscribe();
  }

  async enviar() {
    const novo = !this.threadId;
    this.threadId = await this.sb.enviarComoFuncionario(this.texto.trim(), this.threadId);
    this.texto = '';
    await this.carregar();
    if (novo) this.assinar();
  }

  ngOnDestroy() {
    if (this.canal) this.sb.client.removeChannel(this.canal);
  }
}