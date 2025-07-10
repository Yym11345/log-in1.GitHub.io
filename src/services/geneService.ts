import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Gene = Database['public']['Tables']['gene']['Row'];
type GeneInsert = Database['public']['Tables']['gene']['Insert'];
type GeneUpdate = Database['public']['Tables']['gene']['Update'];

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

// 模拟数据，用于演示
const mockGenes: Gene[] = [
  {
    id: 'mock-1',
    name: '果胶甲酯酶1',
    organism: '烟草',
    enzyme_type: '果胶酶',
    function: '果胶甲酯水解',
    sequence: 'ATGGCTAGCAAGATCGACCTGAAGTACCTGGGCAAGTTCGAGCTGAACATCGACAAGCTGAAGGGC...',
    length: 1515,
    domain: '果胶裂解酶结构域',
    accession: 'TLE001',
    completeness: 'complete' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    name: '丝氨酸蛋白酶1',
    organism: '烟草',
    enzyme_type: '蛋白酶',
    function: '蛋白质水解',
    sequence: 'ATGGCTAGCAAGATCGACCTGAAGTACCTGGGCAAGTTCGAGCTGAACATCGACAAGCTGAAGGGC...',
    length: 1023,
    domain: '丝氨酸蛋白酶催化域',
    accession: 'TLE002',
    completeness: 'complete' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    name: '脂肪酶α/β',
    organism: '烟草',
    enzyme_type: '脂肪酶',
    function: '脂质水解',
    sequence: 'ATGGCTAGCAAGATCGACCTGAAGTACCTGGGCAAGTTCGAGCTGAACATCGACAAGCTGAAGGGC...',
    length: 756,
    domain: '脂肪酶α/β水解酶折叠',
    accession: 'TLE003',
    completeness: 'partial' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    name: 'α-淀粉酶',
    organism: '烟草',
    enzyme_type: '淀粉酶',
    function: '淀粉水解',
    sequence: 'ATGGCTAGCAAGATCGACCTGAAGTACCTGGGCAAGTTCGAGCTGAACATCGACAAGCTGAAGGGC...',
    length: 1234,
    domain: '糖苷水解酶家族',
    accession: 'TLE004',
    completeness: 'complete' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-5',
    name: '纤维素酶',
    organism: '烟草',
    enzyme_type: '纤维素酶',
    function: '纤维素降解',
    sequence: 'ATGGCTAGCAAGATCGACCTGAAGTACCTGGGCAAGTTCGAGCTGAACATCGACAAGCTGAAGGGC...',
    length: 987,
    domain: '糖苷水解酶家族',
    accession: 'TLE005',
    completeness: 'complete' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

class GeneService {
  // 搜索基因
  async searchGenes(
    query: string = '',
    filters: SearchFilters = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<SearchResult> {
    if (!supabase) {
      console.log('Using mock data - Supabase not configured');
      
      // 过滤模拟数据
      let filteredGenes = [...mockGenes];
      
      // 文本搜索
      if (query.trim()) {
        const searchTerm = query.toLowerCase();
        filteredGenes = filteredGenes.filter(gene =>
          gene.name.toLowerCase().includes(searchTerm) ||
          gene.function.toLowerCase().includes(searchTerm) ||
          gene.domain.toLowerCase().includes(searchTerm) ||
          gene.accession.toLowerCase().includes(searchTerm)
        );
      }
      
      // 应用过滤器
      if (filters.enzymeType) {
        filteredGenes = filteredGenes.filter(gene => gene.enzyme_type === filters.enzymeType);
      }
      if (filters.organism) {
        filteredGenes = filteredGenes.filter(gene => gene.organism === filters.organism);
      }
      if (filters.function) {
        filteredGenes = filteredGenes.filter(gene => 
          gene.function.toLowerCase().includes(filters.function!.toLowerCase())
        );
      }
      if (filters.domain) {
        filteredGenes = filteredGenes.filter(gene => 
          gene.domain.toLowerCase().includes(filters.domain!.toLowerCase())
        );
      }
      if (filters.completeness) {
        filteredGenes = filteredGenes.filter(gene => gene.completeness === filters.completeness);
      }
      
      // 分页
      const start = (page - 1) * pageSize;
      const paginatedGenes = filteredGenes.slice(start, start + pageSize);
      
      return {
        genes: paginatedGenes,
        total: filteredGenes.length,
        page,
        pageSize,
      };
    }

    try {
      let queryBuilder = supabase
        .from('gene')
        .select('*', { count: 'exact' });

      // 文本搜索
      if (query.trim()) {
        queryBuilder = queryBuilder.or(
          `"Protein names".ilike.%${query}%,"Gene Names".ilike.%${query}%,"Entry".ilike.%${query}%`
        );
      }

      // 应用过滤器
      if (filters.enzymeType) {
        queryBuilder = queryBuilder.ilike('"Protein names"', `%${filters.enzymeType}%`);
      }
      if (filters.organism) {
        queryBuilder = queryBuilder.eq('"Organism"', filters.organism);
      }
      if (filters.function) {
        queryBuilder = queryBuilder.ilike('"Catalytic activity"', `%${filters.function}%`);
      }
      if (filters.domain) {
        queryBuilder = queryBuilder.ilike('"Active site"', `%${filters.domain}%`);
      }
      if (filters.sequenceLength) {
        const [min, max] = this.parseSequenceLength(filters.sequenceLength);
        if (min !== null) queryBuilder = queryBuilder.gte('"Length"', min);
        if (max !== null) queryBuilder = queryBuilder.lte('"Length"', max);
      }

      // 分页
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      queryBuilder = queryBuilder.range(from, to);

      // 排序
      queryBuilder = queryBuilder.order('"Entry"', { ascending: true });

      const { data, error, count } = await queryBuilder;

      if (error) {
        console.error('搜索失败:', error.message);
        // 返回模拟数据作为后备
        return this.searchGenes(query, filters, page, pageSize);
      }

      return {
        genes: (data || []).map(row => ({
          id: row.Entry,
          name: row["Protein names"] || row["Entry Name"] || row.Entry,
          organism: row.Organism || '未知',
          enzyme_type: this.extractEnzymeType(row["Protein names"] || ''),
          function: row["Catalytic activity"] || '未知功能',
          sequence: row.Sequence || '',
          length: row.Length || 0,
          domain: row["Active site"] || '未知结构域',
          accession: row.Entry,
          completeness: (row.Sequence && row.Sequence.length > 100) ? 'complete' as const : 'partial' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })),
        total: count || 0,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('搜索出错:', error);
      // 返回模拟数据作为后备
      return this.searchGenes(query, filters, page, pageSize);
    }
  }

  // 根据ID获取基因详情
  async getGeneById(id: string): Promise<Gene | null> {
    if (!supabase) {
      console.log('Using mock data - Supabase not configured');
      return mockGenes.find(gene => gene.id === id) || null;
    }

    try {
      const { data, error } = await supabase
        .from('gene')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // 未找到记录
        }
        console.error('获取基因详情失败:', error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.error('获取基因详情出错:', error);
      return null;
    }
  }

  // 获取酶类别统计
  async getEnzymeStats(): Promise<Array<{ enzyme_type: string; count: number }>> {
    if (!supabase) {
      console.log('Using mock data - Supabase not configured');
      return [
        { enzyme_type: 'protease', count: 2876 },
        { enzyme_type: 'pectinase', count: 2145 },
        { enzyme_type: '淀粉酶', count: 1534 },
        { enzyme_type: '脂肪酶', count: 1321 },
        { enzyme_type: '纤维素酶', count: 1256 },
        { enzyme_type: '木质素酶', count: 744 },
      ];
    }

    try {
      const { data, error } = await supabase
        .from('gene')
        .select('"Protein names"')
        .not('enzyme_type', 'is', null);

      if (error) {
        console.error('获取统计数据失败:', error.message);
        return this.getEnzymeStats(); // 返回模拟数据
      }

      // 统计每种酶类型的数量
      const stats: { [key: string]: number } = {};
      data.forEach(row => {
        const enzymeType = this.extractEnzymeType(row["Protein names"] || '');
        stats[enzymeType] = (stats[enzymeType] || 0) + 1;
      });

      return Object.entries(stats).map(([enzyme_type, count]) => ({
        enzyme_type,
        count,
      }));
    } catch (error) {
      console.error('获取统计数据出错:', error);
      return this.getEnzymeStats(); // 返回模拟数据
    }
  }

  // 获取结构域统计
  async getDomainStats(): Promise<Array<{ domain: string; count: number }>> {
    if (!supabase) {
      console.log('Using mock data - Supabase not configured');
      return [
        { domain: '糖苷水解酶家族', count: 1456 },
        { domain: '丝氨酸蛋白酶催化域', count: 1234 },
        { domain: '脂肪酶α/β水解酶折叠', count: 987 },
        { domain: '果胶裂解酶结构域', count: 876 },
        { domain: '半乳糖苷酶结构域', count: 654 },
        { domain: '纤维素结合域', count: 543 },
        { domain: '木质素过氧化物酶', count: 432 },
        { domain: '淀粉结合域', count: 321 },
      ];
    }

    try {
      const { data, error } = await supabase
        .from('gene')
        .select('"Active site"')
        .not('domain', 'is', null);

      if (error) {
        console.error('获取结构域统计失败:', error.message);
        return this.getDomainStats(); // 返回模拟数据
      }

      // 统计每种结构域的数量
      const stats: { [key: string]: number } = {};
      data.forEach(row => {
        const domain = row["Active site"] || '未知结构域';
        stats[domain] = (stats[domain] || 0) + 1;
      });

      return Object.entries(stats)
        .map(([domain, count]) => ({ domain, count }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('获取结构域统计出错:', error);
      return this.getDomainStats(); // 返回模拟数据
    }
  }

  // 添加新基因（管理员功能）
  async addGene(gene: GeneInsert): Promise<Gene | null> {
    if (!supabase) {
      console.log('Supabase not configured - cannot add gene');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('gene')
        .insert(gene)
        .select()
        .single();

      if (error) {
        console.error('添加基因失败:', error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.error('添加基因出错:', error);
      return null;
    }
  }

  // 更新基因信息（管理员功能）
  async updateGene(id: string, updates: GeneUpdate): Promise<Gene | null> {
    if (!supabase) {
      console.log('Supabase not configured - cannot update gene');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('gene')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('更新基因失败:', error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.error('更新基因出错:', error);
      return null;
    }
  }

  // 删除基因（管理员功能）
  async deleteGene(id: string): Promise<boolean> {
    if (!supabase) {
      console.log('Supabase not configured - cannot delete gene');
      return false;
    }

    try {
      const { error } = await supabase
        .from('gene')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('删除基因失败:', error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('删除基因出错:', error);
      return false;
    }
  }

  // 从蛋白质名称中提取酶类型
  private extractEnzymeType(proteinName: string): string {
    const name = proteinName.toLowerCase();
    if (name.includes('protease') || name.includes('蛋白酶')) return '蛋白酶';
    if (name.includes('pectinase') || name.includes('果胶')) return '果胶酶';
    if (name.includes('amylase') || name.includes('淀粉')) return '淀粉酶';
    if (name.includes('lipase') || name.includes('脂肪')) return '脂肪酶';
    if (name.includes('cellulase') || name.includes('纤维')) return '纤维素酶';
    if (name.includes('lignin') || name.includes('木质')) return '木质素酶';
    if (name.includes('peroxidase')) return '过氧化物酶';
    if (name.includes('hydrolase')) return '水解酶';
    return '其他酶';
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