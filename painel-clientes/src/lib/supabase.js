import { createClient } from '@supabase/supabase-js';

// As credenciais vêm do arquivo .env (veja .env.example). Nada fica no código.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Permite mostrar uma tela amigável quando o .env não foi configurado.
export const supabaseConfigurado = Boolean(url && anonKey);

// A chave "anon"/"publishable" é pública por natureza: quem protege os dados
// é o Row Level Security configurado em supabase/schema.sql.
export const supabase = supabaseConfigurado
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
