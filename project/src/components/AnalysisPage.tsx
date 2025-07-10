import React, { useState } from 'react';
import { BarChart3, LineChart, PieChart, TrendingUp, Download, RefreshCw } from 'lucide-react';
import ScanEffect from './ScanEffect';
import GlowButton from './GlowButton';

const AnalysisPage: React.FC = () => {
  const [activeAnalysis, setActiveAnalysis] = useState('distribution');

  const analysisTypes = [
    { id: 'distribution', name: '酶类分布分析', icon: PieChart },
    { id: 'domain', name: '结构域分析', icon: BarChart3 },
    { id: 'sequence', name: '序列比对', icon: LineChart },
    { id: 'functional', name: '功能分类', icon: TrendingUp },
  ];

  const enzymeDistribution = [
    { name: '蛋白酶', count: 2876, percentage: 29.1, color: 'bg-blue-500' },
    { name: '果胶酶', count: 2145, percentage: 21.7, color: 'bg-green-500' },
    { name: '淀粉酶', count: 1534, percentage: 15.5, color: 'bg-purple-500' },
    { name: '脂肪酶', count: 1321, percentage: 13.4, color: 'bg-yellow-500' },
    { name: '纤维素酶', count: 1256, percentage: 12.7, color: 'bg-pink-500' },
    { name: '木质素酶', count: 744, percentage: 7.5, color: 'bg-indigo-500' },
  ];

  const topDomains = [
    { name: '糖苷水解酶家族(GH)', count: 1456, percentage: 14.7 },
    { name: '丝氨酸蛋白酶催化域', count: 1234, percentage: 12.5 },
    { name: '脂肪酶α/β水解酶折叠', count: 987, percentage: 10.0 },
    { name: '果胶裂解酶结构域', count: 876, percentage: 8.9 },
    { name: '半乳糖苷酶结构域', count: 654, percentage: 6.6 },
    { name: '纤维素结合域', count: 543, percentage: 5.5 },
    { name: '木质素过氧化物酶', count: 432, percentage: 4.4 },
    { name: '淀粉结合域', count: 321, percentage: 3.3 },
  ];

  const sequenceStats = [
    { category: '完整序列', count: 8234, percentage: 83.4 },
    { category: '部分序列', count: 1642, percentage: 16.6 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in-up">分析工具</h1>
          <p className="text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            烟叶酶基因的全面分析和可视化工具
          </p>
        </div>

        {/* Analysis Type Selector */}
        <ScanEffect>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">分析类型</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysisTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setActiveAnalysis(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                      activeAnalysis === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">{type.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </ScanEffect>

        {/* Analysis Results */}
        {activeAnalysis === 'distribution' && (
          <div className="space-y-6">
            {/* Enzyme Distribution */}
            <ScanEffect>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">六大类酶基因分布分析</h2>
                  <div className="flex gap-2">
                    <button className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition-all duration-300 transform hover:scale-105">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      刷新
                    </button>
                    <button className="flex items-center px-4 py-2 text-green-600 hover:text-green-800 transition-all duration-300 transform hover:scale-105">
                      <Download className="h-4 w-4 mr-2" />
                      导出
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">各类酶基因数量分布</h3>
                    <div className="space-y-4">
                      {enzymeDistribution.map((enzyme, index) => (
                        <div key={index} className="flex items-center animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                          <div className="w-24 text-sm text-gray-600">{enzyme.name}</div>
                          <div className="flex-1 mx-4">
                            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div 
                                className={`${enzyme.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                                style={{ 
                                  width: `${enzyme.percentage}%`,
                                  animationDelay: `${index * 200}ms`
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-20 text-sm text-gray-600 text-right">{enzyme.count}条</div>
                          <div className="w-12 text-sm text-gray-600 text-right">({enzyme.percentage}%)</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">分布特征分析</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-4">
                        <ScanEffect delay={100}>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-sm text-gray-600">最高占比</p>
                            <p className="text-lg font-semibold text-blue-600">蛋白酶 (29.1%)</p>
                          </div>
                        </ScanEffect>
                        <ScanEffect delay={200}>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-sm text-gray-600">第二高占比</p>
                            <p className="text-lg font-semibold text-green-600">果胶酶 (21.7%)</p>
                          </div>
                        </ScanEffect>
                        <ScanEffect delay={300}>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-sm text-gray-600">总基因数</p>
                            <p className="text-lg font-semibold text-purple-600">9,876条</p>
                          </div>
                        </ScanEffect>
                        <ScanEffect delay={400}>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-sm text-gray-600">酶类别</p>
                            <p className="text-lg font-semibold text-indigo-600">6大类</p>
                          </div>
                        </ScanEffect>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScanEffect>

            {/* Sequence Completeness */}
            <ScanEffect>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">序列完整性分析</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {sequenceStats.map((stat, index) => (
                    <div key={index} className="text-center p-6 bg-gray-50 rounded-lg animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.count.toLocaleString()}条</h3>
                      <p className="text-gray-600 mb-2">{stat.category}</p>
                      <p className="text-lg font-semibold text-blue-600">{stat.percentage}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScanEffect>
          </div>
        )}

        {activeAnalysis === 'domain' && (
          <ScanEffect>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">功能结构域分析</h2>
                <div className="flex gap-2">
                  <button className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition-all duration-300 transform hover:scale-105">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    刷新
                  </button>
                  <button className="flex items-center px-4 py-2 text-green-600 hover:text-green-800 transition-all duration-300 transform hover:scale-105">
                    <Download className="h-4 w-4 mr-2" />
                    导出
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600">共鉴定出 <span className="font-semibold text-blue-600">145种</span> 功能结构域，以下为出现频率最高的结构域：</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">结构域名称</th>
                      <th className="text-left py-3 px-4">出现次数</th>
                      <th className="text-left py-3 px-4">占比</th>
                      <th className="text-left py-3 px-4">分布</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topDomains.map((domain, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <td className="py-3 px-4 font-medium text-gray-900">{domain.name}</td>
                        <td className="py-3 px-4 text-gray-600">{domain.count}</td>
                        <td className="py-3 px-4 text-gray-600">{domain.percentage}%</td>
                        <td className="py-3 px-4">
                          <div className="bg-gray-200 rounded-full h-2 w-32 overflow-hidden">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${domain.percentage}%`,
                                animationDelay: `${index * 200}ms`
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScanEffect>
        )}

        {activeAnalysis === 'sequence' && (
          <ScanEffect>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">序列比对分析</h2>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <LineChart className="h-16 w-16 mx-auto mb-4 text-gray-400 animate-float" />
                <p className="text-gray-600 mb-4">上传序列进行比对分析，支持FASTA格式</p>
                <GlowButton variant="primary">
                  上传序列文件
                </GlowButton>
              </div>
            </div>
          </ScanEffect>
        )}

        {activeAnalysis === 'functional' && (
          <ScanEffect>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">功能分类分析</h2>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-400 animate-float" />
                <p className="text-gray-600 mb-4">基于催化活性和底物特异性进行功能分类</p>
                <GlowButton variant="primary">
                  开始功能分析
                </GlowButton>
              </div>
            </div>
          </ScanEffect>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;