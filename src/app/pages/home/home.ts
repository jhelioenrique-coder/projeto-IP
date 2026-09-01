import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../componentes/header/header';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEdit2 } from '@ng-icons/lucide';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Header, NgIcon, FormsModule],
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

  async onSubmit() {
    console.log('Botão Enviar clicado');
  }
}