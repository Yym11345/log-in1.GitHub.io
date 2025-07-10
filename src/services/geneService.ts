@@ .. @@
   async searchGenes(
     query: string = '',
     filters: SearchFilters = {},
     page: number = 1,
     pageSize: number = 20
   ): Promise<SearchResult> {
     if (!supabase) {
-      throw new Error('Supabase not configured');
      console.log('Using mock data - Supabase not configured');
      return [
        { enzyme_type: '蛋白酶', count: 2876 },
        { enzyme_type: '果胶酶', count: 2145 },
        { enzyme_type: '淀粉酶', count: 1534 },
        { enzyme_type: '脂肪酶', count: 1321 },
        { enzyme_type: '纤维素酶', count: 1256 },
        { enzyme_type: '木质素酶', count: 744 },
      ];
      console.log('Using mock data - Supabase not configured');
      return null;
+      // 返回模拟数据用于演示
+      console.log('Using mock data - Supabase not configured');
+      const mockGenes: Gene[] = [
+        {
+          id: 'mock-1',
+          name: '果胶甲酯酶1',
+          organism: '烟草',
+          enzyme_type: '果胶酶',
+          function: '果胶甲酯水解',
+          sequence: 'ATGGCTAGCAAGATCGACCTG...',
+          length: 1515,
+          domain: '果胶裂解酶结构域',
+          accession: 'TLE001',
+          completeness: 'complete' as const,
+          created_at: new Date().toISOString(),
+          updated_at: new Date().toISOString(),
+        },
+        {
+          id: 'mock-2',
+          name: '丝氨酸蛋白酶1',
+          organism: '烟草',
+          enzyme_type: '蛋白酶',
+          function: '蛋白质水解',
+          sequence: 'ATGGCTAGCAAGATCGACCTG...',
+          length: 1023,
+          domain: '丝氨酸蛋白酶催化域',
+          accession: 'TLE002',
+          completeness: 'complete' as const,
+          created_at: new Date().toISOString(),
+          updated_at: new Date().toISOString(),
+        }
+      ];
      
      return {
        genes: mockGenes,
        total: mockGenes.length,
        page,
        pageSize,
      };
    }
}