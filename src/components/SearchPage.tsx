import React, { useState } from 'react';
import { Search, Filter, Download, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import ScanEffect from './ScanEffect';
import GlowButton from './GlowButton';
import { geneService } from '../services/geneService';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({
    enzymeType: '',
    organism: '',
    function: '',
    sequenceLength: '',
    domain: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // 执行搜索
  const handleSearch = async () => {
    setLoading(true);
    try {
      const filters = {
        enzymeType: selectedFilters.enzymeType || undefined,
        organism: selectedFilters.organism || undefined,
        function: selectedFilters.function || undefined,
        sequenceLength: selectedFilters.sequenceLength || undefined,
        domain: selectedFilters.domain || undefined,
      };

      const result = await geneService.searchGenes(searchQuery, filters, 1, 20);
      
      // 转换数据格式以匹配现有的显示格式
      const formattedResults = result.genes.map(gene => ({
        id: gene.id,
        name: gene.name,
        organism: gene.organism,
        enzymeType: gene.enzyme_type,
        function: gene.function,
        length: `${gene.length.toLocaleString()} bp`,
        domain: gene.domain,
        accession: gene.accession,
        completeness: gene.completeness === 'complete' ? '完整序列' : '部分序列',
      }));
      
      setSearchResults(formattedResults);
      setTotalResults(result.total);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时执行初始搜索
  React.useEffect(() => {
    handleSearch();
  }, []);

  const mockGenes = [
    {
      id: 'TLE001',
      name: '果胶甲酯酶',
      organism: '烟草',
      enzymeType: '果胶酶',
      function: '果胶甲酯水解',
      length: '1,515 bp',
      domain: '果胶裂解酶结构域',
      accession: 'TLE001',
      completeness: '完整序列',
    },
    {
      id: 'TLE002',
      name: '丝氨酸蛋白酶',
      organism: '烟草',
      enzymeType: '蛋白酶',
      function: '蛋白质水解',
      length: '1,023 bp',
      domain: '丝氨酸蛋白酶催化域',
      accession: 'TLE002',
      completeness: '完整序列',
    },
    {
      id: 'TLE003',
      name: '脂肪酶α/β',
      organism: '烟草',
      enzymeType: '脂肪酶',
      function: '脂质水解',
      length: '756 bp',
      domain: '脂肪酶α/β水解酶折叠',
      accession: 'TLE003',
      completeness: '部分序列',
    },
    {
      id: 'TLE004',
      name: 'α-淀粉酶',
      organism: '烟草',
      enzymeType: '淀粉酶',
      function: '淀粉水解',
      length: '1,234 bp',
      domain: '糖苷水解酶家族',
      accession: 'TLE004',
      completeness: '完整序列',
    },
    {
      id: 'TLE005',
      name: '纤维素酶',
      organism: '烟草',
      enzymeType: '纤维素酶',
      function: '纤维素降解',
      length: '987 bp',
      domain: '糖苷水解酶家族',
      accession: 'TLE005',
      completeness: '完整序列',
    },
  ];

  const filterOptions = {
    enzymeType: ['果胶酶', '蛋白酶', '脂肪酶', '淀粉酶', '纤维素酶'],
    organism: ['烟草', '拟南芥', '水稻', '玉米', '大豆'],
    function: ['果胶甲酯水解', '蛋白质水解', '脂质水解', '淀粉水解', '纤维素降解'],
    sequenceLength: ['< 500 bp', '500-1000 bp', '1000-1500 bp', '> 1500 bp'],
    domain: ['果胶裂解酶结构域', '丝氨酸蛋白酶催化域', '脂肪酶α/β水解酶折叠', '糖苷水解酶家族'],
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType as keyof typeof prev] === value ? '' : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ScanEffect />
      
      <div className="container mx-auto px-4 py-8">
        {/* 搜索区域 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="输入基因名称、功能或关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                筛选
                {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </button>
              <div onClick={handleSearch}>
                <GlowButton variant="primary">
                  {loading ? '搜索中...' : '搜索'}
                </GlowButton>
              </div>
            </div>
          </div>

          {/* 筛选器 */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {Object.entries(filterOptions).map(([filterType, options]) => (
                  <div key={filterType}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {filterType === 'enzymeType' ? '酶类型' :
                       filterType === 'organism' ? '来源生物' :
                       filterType === 'function' ? '功能' :
                       filterType === 'sequenceLength' ? '序列长度' :
                       '结构域'}
                    </label>
                    <select
                      value={selectedFilters[filterType as keyof typeof selectedFilters]}
                      onChange={(e) => handleFilterChange(filterType, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">全部</option>
                      {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 搜索结果 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">搜索结果</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">找到 {totalResults} 个基因</span>
              <button className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors transform hover:scale-105">
                <Download className="h-4 w-4 mr-2" />
                导出结果
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    基因ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    基因名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    来源生物
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    酶类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    功能
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    序列长度
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    结构域
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(searchResults.length > 0 ? searchResults : mockGenes).map((gene, index) => (
                  <tr key={gene.id} className="hover:bg-gray-50 transition-colors duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {gene.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {gene.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {gene.organism}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {gene.enzymeType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {gene.function}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {gene.length}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {gene.domain}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3 transition-colors transform hover:scale-105">
                        查看详情
                      </button>
                      <button className="text-green-600 hover:text-green-900 transition-colors transform hover:scale-105">
                        <ExternalLink className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {loading && (
                <tbody>
                  <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">正在搜索...</td></tr>
                </tbody>
              )}
            </table>
          </div>
        </div>

        {/* 快速搜索建议 */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快速搜索</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <h4 className="font-medium text-gray-900 mb-2">按酶类型搜索</h4>
              <p className="text-sm text-gray-600">快速查找特定类型的酶基因</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {filterOptions.enzymeType.slice(0, 3).map(type => (
                  <span key={type} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    {type}
                  </span>
                ))}
              </div>
              <div className="mt-3">
                <GlowButton
                  onClick={handleSearch}
                  variant="primary"
                >
                  {loading ? '搜索中...' : '搜索'}
                </GlowButton>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <h4 className="font-medium text-gray-900 mb-2">按来源生物搜索</h4>
              <p className="text-sm text-gray-600">查找特定生物来源的基因</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {filterOptions.organism.slice(0, 3).map(organism => (
                  <span key={organism} className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                    {organism}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <h4 className="font-medium text-gray-900 mb-2">按功能搜索</h4>
              <p className="text-sm text-gray-600">根据生物功能查找基因</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {filterOptions.function.slice(0, 2).map(func => (
                  <span key={func} className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                    {func.length > 8 ? func.substring(0, 8) + '...' : func}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;