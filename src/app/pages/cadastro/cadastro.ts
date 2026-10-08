import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Header } from "../../componentes/header/header";
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [RouterLink, Header, FormsModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.scss']
})
export class Cadastro {

  mostrarSenha = false;
  mostrarConfirmarSenha = false;

  usuario = {
    nome: '',
    cpf: '',
    nascimento: '',
    celular: '',
    email: '',
    senha: ''
  };

  constructor() { }

  //===================== Formatações ===============================================//

  formatarCPF() {
    let valor = this.usuario.cpf.replace(/\D/g, '');

    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    this.usuario.cpf = valor;
  }

  formatarData() {
    let valor = this.usuario.nascimento.replace(/\D/g, '');

    if (valor.length > 8) {
      valor = valor.substring(0, 8);
    }

    if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    }

    if (valor.length > 5) {
      valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }

    this.usuario.nascimento = valor;
  }

  formatarCelular() {
    let valor = this.usuario.celular.replace(/\D/g, '');

    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');

    if (valor.length >= 11) {
      valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    }

    this.usuario.celular = valor;
  }
}
//===========================================================================//
