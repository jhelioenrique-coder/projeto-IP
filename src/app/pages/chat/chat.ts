import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Header } from '../../componentes/header/header';
import { FooterDefault } from '../../componentes/footer-alt/footer-alt';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [Header, FooterDefault, FormsModule, NgIcon],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {
  filtroStatus = 'todos';
  mostrarFiltro = false;
  ocorrencias: { status: string }[] = [];

  ocorrenciasFiltradas: { status: string }[] = [];
  telaAtual: string = 'chat';
  notificacoesAtivas: boolean = true;

  constructor(
    private location: Location
  ) { }

  mudarTela(tela: string): void {
    this.telaAtual = tela;
    this.mostrarFiltro = false;
  }


  goBack() {
    this.location.back();
  }
  toggleFiltro() {
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

