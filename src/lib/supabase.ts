import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, User } from '@supabase/supabase-js';

// 从环境变量获取配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xdzqbxpqqdzwqbvgkwjh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkenFieHBxcWR6d3Fidmdrd2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcxMjIzNTAsImV4cCI6MjAyMjY5ODM1MH0.kw5_RtF1h3KNz_HzX4M149DuO0-xW6BNxmgI1LoQYXY';

interface AuthResponse {
  data: any;
  error: Error | null;
}

interface UserResponse {
  user: User | null;
  error: Error | null;
}

let supabase: SupabaseClient;
let auth: {
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: Error | null }>;
  getCurrentUser: () => Promise<UserResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  };

  try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: window.localStorage,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  });
  
    console.log('✅ Supabase 客户端创建成功');

  // 认证相关的辅助函数
  auth = {
    // 注册
    signUp: async (email: string, password: string) => {
        try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
      });
        
        if (error) throw error;
        return { data, error: null };
        } catch (err) {
          console.error('注册失败:', err);
        return { data: null, error: err as Error };
        }
    },

    // 登录
    signIn: async (email: string, password: string) => {
        try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
        
        if (error) throw error;
        return { data, error: null };
        } catch (err) {
          console.error('登录失败:', err);
        return { data: null, error: err as Error };
        }
    },

    // 登出
    signOut: async () => {
        try {
      const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
        } catch (err) {
          console.error('登出失败:', err);
        return { error: err as Error };
        }
    },

    // 获取当前用户
    getCurrentUser: async () => {
        try {
      const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return { user, error: null };
        } catch (err) {
          console.error('获取用户信息失败:', err);
        return { user: null, error: err as Error };
        }
    },

    // 重置密码
    resetPassword: async (email: string) => {
        try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`
        });
        
        if (error) throw error;
        return { data, error: null };
        } catch (err) {
          console.error('重置密码失败:', err);
        return { data: null, error: err as Error };
        }
      },
    };
  } catch (err) {
    console.error('❌ Supabase 客户端创建失败:', err);
  throw new Error('Supabase 客户端创建失败');
  }

// 导出实例
export { supabase, auth };