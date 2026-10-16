import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  client: SupabaseClient = createClient(

    'https://ifiluozhdukacqvnxtil.supabase.co',
    'sb_publishable_hvzD-EL3saPN1FKLMLodkw_y8wwMEPt',

    {
      auth: {
        persistSession: this.isBrowser,
        autoRefreshToken: this.isBrowser,
        detectSessionInUrl: this.isBrowser
      }
    }
  );

  // ---------- Funcionário ----------
  async garantirSessaoAnonima() {
    const { data } = await this.client.auth.getSession();
    if (!data.session) await this.client.auth.signInAnonymously();
  }

  async enviarComoFuncionario(body: string, threadId?: string) {
    if (!threadId) {
      const { data, error } = await this.client
        .from('threads').insert({}).select('id').single();
      if (error) throw error;
      threadId = data.id;
    }
    const { error } = await this.client.from('messages')
      .insert({ thread_id: threadId, sender_role: 'employee', body });
    if (error) throw error;
    return threadId!;
  }

  async minhaThread() {
    const { data } = await this.client.from('threads')
      .select('id').order('created_at').limit(1).maybeSingle();
    return data?.id as string | undefined;
  }

  async mensagens(threadId: string) {
    const { data } = await this.client.from('messages')
      .select('*').eq('thread_id', threadId).order('created_at');
    return data ?? [];
  }

  // ---------- Admin ----------
  async cadastrarAdmin(d: any) {
    return this.client.auth.signUp({
      email: d.email,
      password: d.senha,
      options: {
        data: {
          nome_completo: d.nome,
          cpf: d.cpf.replace(/\D/g, ''),
          data_nascimento: d.nascimento,
          celular: d.celular
        }
      }
    });
  }

  login(email: string, senha: string) {
    return this.client.auth.signInWithPassword({ email, password: senha });
  }

  async ehAdmin() {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return false;
    const { data } = await this.client.from('admins')
      .select('user_id').eq('user_id', user.id).maybeSingle();
    return !!data;
  }

  async responder(threadId: string, body: string) {
    return this.client.from('messages')
      .insert({ thread_id: threadId, sender_role: 'admin', body });
  }

  async excluir(id: string) {
    return this.client.from('messages')
      .update({ deleted_at: new Date().toISOString() }).eq('id', id);
  }
}