import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../componentes/header/header'; // ajuste o caminho se a pasta for outra
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';

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

  // Mensagem exibida na tela (use {{ mensagem }} no HTML)
  mensagem = '';
  tipoMensagem: 'erro' | 'sucesso' = 'erro';
  carregando = false;

  usuario = {
    nome: '',
    cpf: '',
    nascimento: '',
    celular: '',
    email: '',
    senha: ''
  };

  constructor(private supabaseService: SupabaseService) { }

  //===================== Mensagens =================================================//

  private erro(texto: string): void {
    this.tipoMensagem = 'erro';
    this.mensagem = texto;
  }

  private sucesso(texto: string): void {
    this.tipoMensagem = 'sucesso';
    this.mensagem = texto;
  }

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

  //===========================================================================//

  voltar(): void {
    window.history.back();
  }

  private lerInput(nome: string): string {
    const input = document.querySelector(
      `input[name="${nome}"]`
    ) as HTMLInputElement | null;

    return input ? input.value : '';
  }

  proximo(): void {
    this.mensagem = '';

    if (
      !this.usuario.nome ||
      !this.usuario.cpf ||
      !this.usuario.email ||
      !this.usuario.senha
    ) {
      this.erro('Preencha os campos obrigatórios.');
      return;
    }

    if (this.usuario.email !== this.lerInput('confEmail')) {
      this.erro('Os e-mails não conferem.');
      return;
    }

    if (this.usuario.senha !== this.lerInput('confSenha')) {
      this.erro('As senhas não conferem.');
      return;
    }

    this.cadastrarUsuario();
  }

  // Converte dd/mm/aaaa para aaaa-mm-dd. Retorna null se a data for inválida.
  private converterData(data: string): string | null {
    const partes = data.split('/');

    if (partes.length !== 3 || partes[2].length !== 4) {
      return null;
    }

    const [dia, mes, ano] = partes.map(Number);
    const d = new Date(ano, mes - 1, dia);

    const valida =
      d.getFullYear() === ano &&
      d.getMonth() === mes - 1 &&
      d.getDate() === dia;

    if (!valida) {
      return null;
    }

    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }

  async cadastrarUsuario() {
    if (this.carregando) return;
    this.carregando = true;

    try {
      const nascimentoFormatado = this.converterData(this.usuario.nascimento);

      // data_nascimento e celular são obrigatórios no banco (admin_profiles)
      if (!nascimentoFormatado) {
        this.erro('Informe uma data de nascimento válida.');
        return;
      }

      if (!this.usuario.celular) {
        this.erro('Informe o celular.');
        return;
      }

      // O trigger handle_new_user grava em admin_profiles lendo estes campos
      // de raw_user_meta_data, então os nomes precisam ser exatamente estes.
      const { data, error } =
        await this.supabaseService.client.auth.signUp({
          email: this.usuario.email,
          password: this.usuario.senha,
          options: {
            data: {
              nome_completo: this.usuario.nome,
              cpf: this.usuario.cpf,
              data_nascimento: nascimentoFormatado,
              celular: this.usuario.celular
            }
          }
        });

      if (error || !data.user) {
        console.error('Erro no signUp:', error);
        this.erro(error?.message || 'Erro no cadastro.');
        return;
      }

      this.sucesso('Cadastro realizado com sucesso!');

      this.usuario = {
        nome: '',
        cpf: '',
        nascimento: '',
        celular: '',
        email: '',
        senha: ''
      };

      const confEmailInput = document.querySelector(
        'input[name="confEmail"]'
      ) as HTMLInputElement | null;

      const confSenhaInput = document.querySelector(
        'input[name="confSenha"]'
      ) as HTMLInputElement | null;

      if (confEmailInput) confEmailInput.value = '';
      if (confSenhaInput) confSenhaInput.value = '';

    } catch (erro) {
      console.error('Erro ao cadastrar:', erro);
      this.erro('Erro ao cadastrar. Tente novamente.');
    } finally {
      this.carregando = false;
    }
  }
}