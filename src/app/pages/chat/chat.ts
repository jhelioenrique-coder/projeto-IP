import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Header } from '../../componentes/header/header';
import { FooterDefault } from '../../componentes/footer-alt/footer-alt';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../chat.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [Header, FooterDefault, FormsModule, DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit, OnDestroy {
  filtroStatus = 'todos';
  mostrarFiltro = false;
  ocorrencias: { status: string }[] = [];
  ocorrenciasFiltradas: { status: string }[] = [];
  telaAtual: string = 'chat';
  notificacoesAtivas: boolean = true;

  constructor(
    private location: Location,
    public chat: ChatService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.chat.carregar();
      this.chat.escutar();
    } catch (error) {
      console.error('Erro ao carregar mensagens do chat:', error);
    }
  }

  ngOnDestroy(): void {
    this.chat.parar();
  }

  mudarTela(tela: string): void {
    this.telaAtual = tela;
    this.mostrarFiltro = false;
  }

  goBack(): void {
    this.location.back();
  }

  toggleFiltro(): void {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

  filtrar(status: string): void {
    this.filtroStatus = status;

    if (status === 'todos') {
      this.ocorrenciasFiltradas = [...this.ocorrencias];
    } else {
      this.ocorrenciasFiltradas = this.ocorrencias.filter(
        (o: { status: string }) => o.status === status
      );
    }
  }
}