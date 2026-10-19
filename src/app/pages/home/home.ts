import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderHome } from '../../componentes/header_home/headerHome';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEdit2 } from '@ng-icons/lucide';
import { FormsModule } from '@angular/forms';
import { FooterDefault } from '../../componentes/footer-alt/footer-alt';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, HeaderHome, NgIcon, FormsModule, FooterDefault],
  providers: [
    provideIcons({
      lucideEdit2,
    })
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  mensagem: string = '';
  statusMenuAberto = false;
  menuAberto = false;
  enviando = false;

  constructor(
    private chat: ChatService,
    private router: Router
  ) { }

  async onSubmit() {
    const texto = this.mensagem.trim();
    if (!texto || this.enviando) return;
    this.enviando = true;
    try {
      await this.chat.enviar(texto);
      this.mensagem = '';
      this.router.navigate(['/chat']);
    } catch (e) {
      console.error('Erro ao enviar menssagem:', e);
    } finally {
      this.enviando = false;
    }
  }
}