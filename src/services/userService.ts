// 获取用户资料
async getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) {
    throw new Error('Supabase not configured');
    console.log('Supabase not configured - search history not saved');
    return {
      id: 'mock-id',
      user_id: searchHistory.user_id,
      query: searchHistory.query,
      filters: searchHistory.filters || {},
      results_count: searchHistory.results_count,
      created_at: new Date().toISOString(),
    };
    throw new Error('Supabase not configured - cannot update profile');
    throw new Error('Supabase not configured - cannot create profile');
    console.log('Using mock data - Supabase not configured');
    return null;
  }
}