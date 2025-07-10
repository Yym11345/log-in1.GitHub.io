import React, { useState } from 'react';
import { Search, Filter, Download, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import ScanEffect from './ScanEffect';
import GlowButton from './GlowButton';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    enzymeType: '',
    organism: '',
    function: '',
    sequenceLength: '',
    domain: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const mockGenes = [
    {
      id: 'TLE001',
      name: '果胶甲酯酶',
      organism: '烟草',
      enzymeType: '果胶酶',
      function: '果胶甲酯水解',
      length: '1,515 bp',
      domain: '果胶裂解酶结构域',
      accession: 'NC_001879.2',
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
      accession: 'NC_001880.1',
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
      accession: 'NC_001881.3',
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
      accession: 'NC_001882.1',
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
      accession: 'NC_001883.2',
      completeness: '完整序列',
    },
  ];

  const filterOptions = {
    enzymeType: ['果胶酶', '蛋白酶', '脂肪酶', '淀粉酶', '纤维素酶', '木质素酶'],
    organism: ['烟草', '林烟草', '绒毛烟草'],
    function: ['果胶甲酯水解', '蛋白质水解', '脂质水解', '淀粉水解', '纤维素降解', '木质素降解'],
    sequenceLength: ['<500 bp', '500-1000 bp', '1000-1500 bp', '>1500 bp'],
    domain: ['糖苷水解酶家族', '丝氨酸蛋白酶催化域', '脂肪酶α/β水解酶折叠', '果胶裂解酶结构域', '半乳糖苷酶结构域'],
  };

  const enzymeStats = [
    { name: '蛋白酶', count: 2876, percentage: 29.1, color: 'bg-blue-500' },
    { name: '果胶酶', count: 2145, percentage: 21.7, color: 'bg-green-500' },
    { name: '淀粉酶', count: 1534, percentage: 15.5, color: 'bg-purple-500' },
    { name: '脂肪酶', count: 1321, percentage: 13.4, color: 'bg-yellow-500' },
    { name: '纤维素酶', count: 1256, percentage: 12.7, color: 'bg-pink-500' },
    { name: '木质素酶', count: 744, percentage: 7.5, color: 'bg-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in-up">基因检索</h1>
          <p className="text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            使用多维度过滤选项搜索和探索烟叶酶基因数据库
          </p>
        </div>

        {/* Enzyme Distribution Stats */}
        <ScanEffect>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">六大类酶基因分布</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enzymeStats.map((enzyme, index) => (
                <div key={index} className="flex items-center animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{enzyme.name}</span>
                      <span className="text-sm text-gray-600">{enzyme.count}条 ({enzyme.percentage}%)</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`${enzyme.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ 
                          width: `${enzyme.percentage}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScanEffect>

        {/* Search Bar */}
        <ScanEffect>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="按基因名称、酶类别、功能特征或结构域搜索..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  高级过滤
                  {showFilters ? (
                    <ChevronUp className="h-4 w-4 ml-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-2" />
                  )}
                </button>
                <GlowButton variant="primary">
                  搜索
                </GlowButton>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(filterOptions).map(([key, options]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {key === 'enzymeType' ? '酶类别' : 
                         key === 'organism' ? '物种' :
                         key === 'function' ? '功能特征' :
                         key === 'sequenceLength' ? '序列长度' : '结构域'}
                      </label>
                      <select
                        value={selectedFilters[key as keyof typeof selectedFilters]}
                        onChange={(e) => setSelectedFilters({
                          ...selectedFilters,
                          [key]: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">全部</option>
                        {options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScanEffect>

        {/* Results */}
        <ScanEffect>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">搜索结果</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">找到 {mockGenes.length} 个基因</span>
                <button className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors transform hover:scale-105">
                  <Download className="h-4 w-4 mr-2" />
                  导出结果
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">基因ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">酶类别</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">功能</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">长度</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">结构域</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">完整性</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockGenes.map((gene, index) => (
                    <tr key={gene.id} className="hover:bg-gray-50 transition-colors duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {gene.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {gene.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {gene.enzymeType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gene.function}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gene.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {gene.domain}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          gene.completeness === '完整序列' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {gene.completeness}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-800 mr-3 transform hover:scale-110 transition-all duration-200">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800 transform hover:scale-110 transition-all duration-200">
                          <Download className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScanEffect>
      </div>
    </div>
  );
};

export default SearchPage;