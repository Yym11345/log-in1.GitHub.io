@@ .. @@
   async searchGenes(
     query: string = '',
     filters: SearchFilters = {},
     page: number = 1,
     pageSize: number = 20
   ): Promise<SearchResult> {
     if (!supabase) {
-      throw new Error('Supabase not configured');
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
+        },
+      ];
+      
+      return {
+        genes:      m
   }ockGenes,
+        total: mockGenes.length,
+        page,
+        pageSize,
+      };
     }