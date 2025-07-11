# 烟叶酶基因资源管理平台

专业的烟叶酶基因数据库和分析平台，收录9,876条非冗余基因序列。

## 功能特性

- 🔍 多维度基因检索
- 📊 数据分析工具
- 👤 用户认证系统
- 📱 响应式设计
- 🔒 安全的数据管理

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Supabase

#### 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 注册/登录账户
3. 点击 "New Project"
4. 填写项目信息：
   - 项目名称：tobacco-gene-db
   - 数据库密码：设置一个强密码
   - 地区：选择离您最近的地区
5. 点击 "Create new project"

#### 获取 API 密钥

项目创建完成后：

1. 在项目仪表板中，点击左侧菜单的 "Settings"
2. 点击 "API"
3. 复制以下信息：
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: 匿名公钥

#### 配置环境变量

1. 复制 `.env.example` 为 `.env`：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，替换占位符：
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

### 3. 设置数据库

数据库迁移文件已经准备好，包含：
- 基因信息表 (`genes`)
- 用户资料表 (`user_profiles`)
- 搜索历史表 (`search_history`)

在 Supabase 仪表板中：

1. 点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制并执行 `supabase/migrations/20250709073247_broad_coast.sql` 中的内容
4. 然后执行 `supabase/migrations/20250709073307_quiet_hat.sql` 中的内容

### 4. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

## 用户认证功能

### 注册新用户

1. 点击页面右上角的 "登录" 按钮
2. 在弹出的模态框中点击 "立即注册"
3. 填写邮箱和密码（密码至少6位）
4. 点击 "注册" 按钮
5. 检查邮箱中的验证链接（可选，取决于配置）

### 用户登录

1. 点击页面右上角的 "登录" 按钮
2. 输入注册时使用的邮箱和密码
3. 点击 "登录" 按钮

### 密码重置

1. 在登录模态框中点击 "重置密码"
2. 输入注册时使用的邮箱
3. 点击 "发送重置邮件"
4. 检查邮箱中的重置链接

### 用户资料

登录后，您可以：
- 查看用户资料
- 保存搜索历史
- 导出搜索结果
- 管理个人设置

## 数据库结构

### genes 表
- 存储基因信息
- 包含序列、功能、结构域等数据
- 支持全文搜索

### user_profiles 表
- 存储用户扩展信息
- 包含姓名、机构、研究领域等

### search_history 表
- 记录用户搜索历史
- 支持搜索条件和结果统计

## 安全特性

- 行级安全 (RLS) 保护用户数据
- 邮箱密码认证
- 安全的 API 密钥管理
- 用户数据隔离

## 技术栈

- **前端**: React + TypeScript + Tailwind CSS
- **后端**: Supabase (PostgreSQL + Auth)
- **构建工具**: Vite
- **图标**: Lucide React
- **部署**: 支持 Netlify 等平台

## 开发指南

### 添加新的基因数据

```typescript
import { geneService } from './src/services/geneService';

const newGene = {
  name: '基因名称',
  organism: '烟草',
  enzyme_type: '蛋白酶',
  function: '蛋白质水解',
  sequence: 'ATGCGATCG...',
  length: 1234,
  domain: '催化域',
  accession: 'ACC001',
  completeness: 'complete'
};

await geneService.addGene(newGene);
```

### 搜索基因

```typescript
const results = await geneService.searchGenes(
  '蛋白酶', // 搜索查询
  { enzymeType: '蛋白酶' }, // 过滤条件
  1, // 页码
  20 // 每页数量
);
```

## 故障排除

### Supabase 连接问题

如果看到 "Supabase not configured" 错误：

1. 检查 `.env` 文件是否存在且配置正确
2. 确认环境变量名称正确（`VITE_` 前缀）
3. 重启开发服务器
4. 检查 Supabase 项目是否正常运行

### 认证问题

如果登录/注册失败：

1. 检查 Supabase 项目的认证设置
2. 确认邮箱确认设置（默认禁用）
3. 检查网络连接
4. 查看浏览器控制台错误信息

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License