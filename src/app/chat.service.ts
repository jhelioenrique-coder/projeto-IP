import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Message {
    id: string;
    thread_id: string;
    sender_role: string;
    body: string;
    created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
    threadId = signal<string | null>(
        typeof localStorage !== 'undefined'
            ? localStorage.getItem('threadId')
            : null
    );

    messages = signal<Message[]>([]);
    private canal: any = null;

    constructor(private sb: SupabaseService) { }

    private get db() {
        return this.sb.client;
    }

    private async garantirSessao() {
        const { data: sessionData, error: sessionError } =
            await this.db.auth.getSession();

        if (sessionError) throw sessionError;

        if (sessionData.session) {
            return sessionData.session.user;
        }

        const { data, error } = await this.db.auth.signInAnonymously();

        if (error) throw error;
        if (!data.user) {
            throw new Error('Não foi possível criar a sessão anônima.');
        }

        return data.user;
    }

    private async garantirThread(): Promise<string> {
        const user = await this.garantirSessao();
        const threadAtual = this.threadId();

        // Reutiliza a conversa salva somente se ela ainda pertencer
        // ao usuário autenticado.
        if (threadAtual) {
            const { data, error } = await this.db
                .from('threads')
                .select('id')
                .eq('id', threadAtual)
                .maybeSingle();

            if (error) throw error;

            if (data) {
                return data.id;
            }

            // A conversa antiga pode pertencer a outra sessão.
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('threadId');
            }

            this.threadId.set(null);
            this.messages.set([]);
            this.parar();
        }

        const { data, error } = await this.db
            .from('threads')
            .insert({
                author_id: user.id,
                user_id: user.id
            })
            .select('id')
            .single();

        if (error) throw error;

        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('threadId', data.id);
        }

        this.threadId.set(data.id);
        this.escutar();

        return data.id;
    }

    async enviar(body: string): Promise<void> {
        const texto = body.trim();

        if (!texto) {
            throw new Error('Digite uma mensagem antes de enviar.');
        }

        const thread_id = await this.garantirThread();

        const { data: authData, error: authError } =
            await this.db.auth.getUser();

        console.log('Usuário autenticado:', authData.user?.id);
        console.log('Erro de autenticação:', authError);
        console.log('Thread usada:', thread_id);

        const { error } = await this.db
            .from('messages')
            .insert({
                thread_id,
                sender_role: 'employee',
                body: texto
            });

        if (error) {
            console.error('Erro ao inserir mensagem:', error);
            throw error;
        }
    }

    async carregar(): Promise<void> {
        const id = this.threadId();

        if (!id) return;

        const { data, error } = await this.db
            .from('messages')
            .select('*')
            .eq('thread_id', id)
            .order('created_at', { ascending: true });

        if (error) throw error;

        this.messages.set((data ?? []) as Message[]);
    }

    escutar(): void {
        const id = this.threadId();

        if (!id || typeof window === 'undefined') return;

        this.parar();

        this.canal = this.db
            .channel('chat-' + id)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `thread_id=eq.${id}`
                },
                (payload: any) => {
                    const nova = payload.new as Message;

                    this.messages.update(atual => {
                        if (atual.some(m => m.id === nova.id)) {
                            return atual;
                        }

                        return [...atual, nova].sort(
                            (a, b) =>
                                new Date(a.created_at).getTime() -
                                new Date(b.created_at).getTime()
                        );
                    });
                }
            )
            .subscribe();
    }

    parar(): void {
        if (this.canal) {
            void this.db.removeChannel(this.canal);
            this.canal = null;
        }
    }
}