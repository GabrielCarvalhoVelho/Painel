// src/services/authService.ts
import { setAccessToken } from '../lib/supabase';

export interface JWTPayload {
  sub: string;          // UUID do usuário (vem como "sub" no JWT assinado pelo n8n)
  nome?: string;
  email?: string;
  role?: string;        // deve ser "authenticated"
  aud?: string;         // deve ser "authenticated"
  exp?: number;
  iat?: number;
}

// 🔧 Detecta ambiente de desenvolvimento usando múltiplas verificações
const isDevelopment = () => {
  // Método 1: Vite MODE (mais confiável)
  if (import.meta.env.MODE === 'development') return true;

  // Método 2: Variável customizada
  if (import.meta.env.VITE_ZE_AMBIENTE === 'development') return true;

  // Método 3: Verificação de hostname (localhost/127.0.0.1)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      return true;
    }
  }

  // Método 4: Verificação DEV explícita
  if (import.meta.env.DEV === true) return true;

  return false;
};

const DEV_BYPASS = isDevelopment();

// Log de diagnóstico
if (typeof window !== 'undefined') {
  console.log('🔍 Debug Ambiente:', {
    'import.meta.env.MODE': import.meta.env.MODE,
    'import.meta.env.DEV': import.meta.env.DEV,
    'import.meta.env.PROD': import.meta.env.PROD,
    'VITE_ZE_AMBIENTE': import.meta.env.VITE_ZE_AMBIENTE,
    'window.location.hostname': window.location.hostname,
    'DEV_BYPASS ativo': DEV_BYPASS
  });
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: { user_id: string; nome: string } | null = null;
  private readonly TOKEN_KEY = 'ze_safra_token';

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // 🔧 Usuário fake no DEV (bypass)
  private getBypassedDevUser() {
    return {
      user_id: 'c7f13743-67ef-45d4-807c-9f5de81d4999',
      nome: 'Gabriel - Teste',
    };
  }

  // 🔑 Inicializa sessão ao carregar app
  async init(): Promise<{ user_id: string; nome: string } | null> {
    if (DEV_BYPASS) {
      const dev = this.getBypassedDevUser();
      this.currentUser = dev;
      console.log('🔓 MODO DESENVOLVIMENTO ATIVO - Bypass habilitado');
      console.log('👤 Usuário de desenvolvimento:', dev);

      // 🔑 Criar e injetar JWT válido para bypass de desenvolvimento
      await this.injectDevBypassToken(dev.user_id, dev.nome);

      return dev;
    }

    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      console.warn('⚠️ Nenhum token encontrado no localStorage');
      return null;
    }

    // 👉 injeta o token no supabase
    try {
      await setAccessToken(token);
    } catch (e) {
      console.error('❌ Falha ao setar token no Supabase:', e);
      return null;
    }

    // 🔍 decodifica o JWT
    try {
      const payloadB64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload: JWTPayload = JSON.parse(atob(payloadB64));

      if (!payload?.sub) throw new Error('JWT inválido: sem `sub`');

      this.currentUser = {
        user_id: payload.sub,
        nome: payload.nome || payload.email || 'Usuário',
      };

      console.log('✅ Sessão restaurada via JWT custom:', this.currentUser);
      return this.currentUser;
    } catch (err) {
      console.error('❌ Falha ao decodificar JWT:', err);
      return null;
    }
  }

  // 🚪 Logout
  async logout() {
    this.currentUser = null;
    localStorage.removeItem(this.TOKEN_KEY);
    // não chama supabase.auth.signOut(), porque não usamos GoTrue
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  // 🔧 Cria e injeta um JWT válido para desenvolvimento
  private async injectDevBypassToken(userId: string, nome: string) {
    try {
      // Criar payload JWT para desenvolvimento
      const header = {
        alg: 'HS256',
        typ: 'JWT'
      };

      const now = Math.floor(Date.now() / 1000);
      const payload: JWTPayload = {
        sub: userId,
        nome: nome,
        email: 'dev@zedasafra.com',
        role: 'authenticated',
        aud: 'authenticated',
        exp: now + (60 * 60 * 24), // 24 horas
        iat: now
      };

      // Codificar em base64url (simplificado para desenvolvimento)
      const base64UrlEncode = (obj: any) => {
        const json = JSON.stringify(obj);
        return btoa(json)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
      };

      const headerEncoded = base64UrlEncode(header);
      const payloadEncoded = base64UrlEncode(payload);

      // Para desenvolvimento, criar um token simples (não assinado corretamente)
      // Importante: Isso só funciona porque as políticas RLS verificam apenas o sub/user_id
      const devToken = `${headerEncoded}.${payloadEncoded}.dev-signature`;

      // Injetar o token no Supabase
      await setAccessToken(devToken);

      console.log('🔑 JWT de desenvolvimento criado e injetado para RLS bypass');
    } catch (error) {
      console.error('❌ Erro ao criar JWT de desenvolvimento:', error);
      throw error;
    }
  }
}
