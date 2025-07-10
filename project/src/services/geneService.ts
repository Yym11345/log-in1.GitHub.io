import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Gene = Database['public']['Tables']['genes']['Row'];
type GeneInsert = Database['public']['Tables']['genes']['Insert'];
type GeneUpdate = Database['public']['Tables']['genes']['Update'];

export interface SearchFilters {
  enzymeType?: string;
  organism?: string;
  function?: string;
  sequenceLength?: string;
  domain?: string;
  completeness?: 'complete' | 'partial';
}

export interface SearchResult {
  genes: Gene[];
  total: number;
  page: number;
  pageSize: number;
}

class GeneService {
  // 搜索基因
  async searchGenes(
    query: string = '',
    filters: SearchFilters = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<SearchResult> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    let queryBuilder = supabase
      .from('genes')
      .select('*', { count: 'exact' });

    // 文本搜索
    if (query.trim()) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,function.ilike.%${query}%,domain.ilike.%${query}%,accession.ilike.%${query}%`
      );
    }

    // 应用过滤器
    if (filters.enzymeType) {
      queryBuilder = queryBuilder.eq('enzyme_type', filters.enzymeType);
    }
    if (filters.organism) {
      queryBuilder = queryBuilder.eq('organism', filters.organism);
    }
    if (filters.function) {
      queryBuilder = queryBuilder.ilike('function', `%${filters.function}%`);
    }
    if (filters.domain) {
      queryBuilder = queryBuilder.ilike('domain', `%${filters.domain}%`);
    }
    if (filters.completeness) {
      queryBuilder = queryBuilder.eq('completeness', filters.completeness);
    }
    if (filters.sequenceLength) {
      const [min, max] = this.parseSequenceLength(filters.sequenceLength);
      if (min !== null) queryBuilder = queryBuilder.gte('length', min);
      if (max !== null) queryBuilder = queryBuilder.lte('length', max);
    }

    // 分页
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    queryBuilder = queryBuilder.range(from, to);

    // 排序
    queryBuilder = queryBuilder.order('name', { ascending: true });

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw new Error(`搜索失败: ${error.message}`);
    }

    return {
      genes: data || [],
      total: count || 0,
      page,
      pageSize,
    };
  }

  // 根据ID获取基因详情
  async getGeneById(id: string): Promise<Gene | null> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('genes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // 未找到记录
      }
      throw new Error(`获取基因详情失败: ${error.message}`);
    }

    return data;
  }

  // 获取酶类别统计
  async getEnzymeStats(): Promise<Array<{ enzyme_type: string; count: number }>> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('genes')
      .select('enzyme_type')
      .not('enzyme_type', 'is', null);

    if (error) {
      throw new Error(`获取统计数据失败: ${error.message}`);
    }

    // 统计每种酶类型的数量
    const stats: { [key: string]: number } = {};
    data.forEach(gene => {
      stats[gene.enzyme_type] = (stats[gene.enzyme_type] || 0) + 1;
    });

    return Object.entries(stats).map(([enzyme_type, count]) => ({
      enzyme_type,
      count,
    }));
  }

  // 获取结构域统计
  async getDomainStats(): Promise<Array<{ domain: string; count: number }>> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('genes')
      .select('domain')
      .not('domain', 'is', null);

    if (error) {
      throw new Error(`获取结构域统计失败: ${error.message}`);
    }

    // 统计每种结构域的数量
    const stats: { [key: string]: number } = {};
    data.forEach(gene => {
      stats[gene.domain] = (stats[gene.domain] || 0) + 1;
    });

    return Object.entries(stats)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count);
  }

  // 添加新基因（管理员功能）
  async addGene(gene: GeneInsert): Promise<Gene> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('genes')
      .insert(gene)
      .select()
      .single();

    if (error) {
      throw new Error(`添加基因失败: ${error.message}`);
    }

    return data;
  }

  // 更新基因信息（管理员功能）
  async updateGene(id: string, updates: GeneUpdate): Promise<Gene> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('genes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`更新基因失败: ${error.message}`);
    }

    return data;
  }

  // 删除基因（管理员功能）
  async deleteGene(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('genes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`删除基因失败: ${error.message}`);
    }
  }

  // 解析序列长度过滤器
  private parseSequenceLength(lengthFilter: string): [number | null, number | null] {
    switch (lengthFilter) {
      case '<500 bp':
        return [null, 499];
      case '500-1000 bp':
        return [500, 1000];
      case '1000-1500 bp':
        return [1000, 1500];
      case '>1500 bp':
        return [1501, null];
      default:
        return [null, null];
    }
  }
}

export const geneService = new GeneService();