# Supabase 基因数据连接指南

## 第一步：获取 Supabase 项目信息

### 1. 登录 Supabase
1. 访问 [https://supabase.com](https://supabase.com)
2. 使用您的账户登录
3. 选择您的项目（包含基因数据的项目）

### 2. 获取项目配置信息
1. 在项目仪表板中，点击左侧菜单的 **"Settings"**（设置）
2. 点击 **"API"** 选项卡
3. 复制以下信息：
   - **Project URL**: 格式类似 `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: 一长串字符，用于客户端访问

## 第二步：配置环境变量

### 1. 编辑 .env 文件
在项目根目录的 `.env` 文件中，将占位符替换为实际值：

```env
# 替换为您的实际 Supabase 项目 URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# 替换为您的实际 Supabase 匿名公钥
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### 2. 重启开发服务器
```bash
npm run dev
```

## 第三步：验证数据库表结构

### 确认基因表结构
根据您提供的数据库架构，基因表名为 `gene`，包含以下字段：

- `Entry` (主键)
- `Reviewed`
- `Entry Name`
- `Protein names`
- `Gene Names`
- `Organism`
- `Length`
- `Sequence`
- `Active site`
- `Catalytic activity`
- `EC number`

## 第四步：测试连接

### 1. 检查浏览器控制台
1. 打开浏览器开发者工具 (F12)
2. 查看 Console 标签
3. 应该看到 "Supabase client initialized successfully" 消息

### 2. 测试搜索功能
1. 访问网站的"基因检索"页面
2. 尝试搜索基因
3. 如果连接成功，将显示来自数据库的实际数据

## 第五步：数据映射说明

网站会自动将数据库字段映射到显示格式：

| 数据库字段 | 网站显示 |
|-----------|---------|
| Entry | 基因ID |
| Protein names / Entry Name | 基因名称 |
| Organism | 物种 |
| Catalytic activity | 功能描述 |
| Length | 序列长度 |
| Active site | 结构域 |
| Sequence | 基因序列 |

## 故障排除

### 问题1：仍显示模拟数据
**原因**: Supabase 配置不正确
**解决方案**:
1. 检查 `.env` 文件中的 URL 和密钥是否正确
2. 确认 URL 以 `https://` 开头，以 `.supabase.co` 结尾
3. 重启开发服务器

### 问题2：连接错误
**原因**: 网络问题或权限问题
**解决方案**:
1. 检查网络连接
2. 确认 Supabase 项目状态正常
3. 检查 API 密钥权限

### 问题3：搜索无结果
**原因**: 表名或字段名不匹配
**解决方案**:
1. 确认数据库中表名为 `gene`
2. 检查字段名是否与架构一致
3. 查看浏览器控制台的错误信息

## 高级配置

### 启用行级安全 (RLS)
如果您的 Supabase 表启用了 RLS，需要添加相应的策略：

```sql
-- 允许公开读取基因数据
CREATE POLICY "公开读取基因数据"
  ON gene
  FOR SELECT
  TO public
  USING (true);
```

### 性能优化
为常用搜索字段添加索引：

```sql
-- 为蛋白质名称添加索引
CREATE INDEX idx_gene_protein_names ON gene USING gin(to_tsvector('english', "Protein names"));

-- 为物种添加索引
CREATE INDEX idx_gene_organism ON gene("Organism");

-- 为序列长度添加索引
CREATE INDEX idx_gene_length ON gene("Length");
```

## 验证连接成功

连接成功后，您应该能够：

1. ✅ 在搜索页面看到真实的基因数据
2. ✅ 使用过滤器筛选数据
3. ✅ 看到正确的统计数字
4. ✅ 浏览器控制台没有连接错误

如果遇到问题，请检查上述步骤或查看浏览器控制台的错误信息。