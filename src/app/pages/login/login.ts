import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Header } from '../../componentes/header/header';
import { FooterDefault } from '../../componentes/footer-alt/footer-alt';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { featherCornerUpLeft } from '@ng-icons/feather-icons';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FooterDefault, Header, NgIcon,],
  providers: [provideIcons({ featherCornerUpLeft })],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  loginForm: FormGroup;

  isRecoveryMode = false;
  mostrarSenha = false;

  constructor(private fb: FormBuilder) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  toggleRecoveryMode(): void {
    this.isRecoveryMode = !this.isRecoveryMode;

    if (this.isRecoveryMode) {
      this.loginForm.get('password')?.clearValidators();
      this.loginForm.get('password')?.updateValueAndValidity();
    } else {
      this.loginForm.get('password')?.setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);

      this.loginForm.get('password')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.isRecoveryMode) {
      console.log(
        'Solicitação de recuperação:',
        this.loginForm.value.email
      );

      return;
    }

    console.log('Login:', this.loginForm.value);
  }
}