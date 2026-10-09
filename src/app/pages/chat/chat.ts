
import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Header } from '../../componentes/header/header';
import { FooterDefault } from '../../componentes/footer-alt/footer-alt';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [Header, FooterDefault],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {

  constructor(
    private location: Location
  ) { }

  goBack() {
    this.location.back();
  }

}

