import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderHome } from '../../componentes/header_home/headerHome';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEdit2 } from '@ng-icons/lucide';
import { FormsModule } from '@angular/forms';
import { FooterDefault } from '../../componentes/footer-alt/footer-alt';

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

  async onSubmit() {
    console.log('Botão Enviar clicado');
  }
}