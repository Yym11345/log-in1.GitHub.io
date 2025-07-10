import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any;
let auth: any;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.warn('Supabase not configured. Please set up your Supabase credentials.');
  // Create a mock client that won't cause errors
  supabase = null;
  auth = {
    signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signIn: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: new Error('Supabase not configured') }),
    getCurrentUser: async () => ({ user: null, error: new Error('Supabase not configured') }),
    resetPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 认证相关的辅助函数
  auth = {
    // 注册
    signUp: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data, error };
    },

    // 登录
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    },

    // 登出
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      return { error };
    },

    // 获取当前用户
    getCurrentUser: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error };
    },

    // 重置密码
    resetPassword: async (email: string) => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      return { data, error };
    },
  };
}

export { supabase, auth };