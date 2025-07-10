/*
  # 初始数据库架构

  1. 新建表
    - `genes` - 基因信息表
      - `id` (uuid, 主键)
      - `name` (text) - 基因名称
      - `organism` (text) - 物种
      - `enzyme_type` (text) - 酶类别
      - `function` (text) - 功能描述
      - `sequence` (text) - 基因序列
      - `length` (integer) - 序列长度
      - `domain` (text) - 功能结构域
      - `accession` (text) - 登录号
      - `completeness` (text) - 完整性状态
      - `created_at` (timestamptz) - 创建时间
      - `updated_at` (timestamptz) - 更新时间

    - `user_profiles` - 用户资料表
      - `id` (uuid, 主键)
      - `user_id` (uuid, 外键到auth.users)
      - `full_name` (text) - 全名
      - `organization` (text) - 机构
      - `research_field` (text) - 研究领域
      - `created_at` (timestamptz) - 创建时间
      - `updated_at` (timestamptz) - 更新时间

    - `search_history` - 搜索历史表
      - `id` (uuid, 主键)
      - `user_id` (uuid, 外键到auth.users)
      - `query` (text) - 搜索查询
      - `filters` (jsonb) - 过滤条件
      - `results_count` (integer) - 结果数量
      - `created_at` (timestamptz) - 创建时间

  2. 安全设置
    - 为所有表启用行级安全(RLS)
    - 添加适当的安全策略
*/

-- 创建基因信息表
CREATE TABLE IF NOT EXISTS genes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  organism text NOT NULL,
  enzyme_type text NOT NULL,
  function text NOT NULL,
  sequence text NOT NULL,
  length integer NOT NULL DEFAULT 0,
  domain text NOT NULL,
  accession text NOT NULL UNIQUE,
  completeness text NOT NULL CHECK (completeness IN ('complete', 'partial')) DEFAULT 'complete',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text,
  organization text,
  research_field text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建搜索历史表
CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  query text NOT NULL,
  filters jsonb DEFAULT '{}',
  results_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_genes_enzyme_type ON genes(enzyme_type);
CREATE INDEX IF NOT EXISTS idx_genes_organism ON genes(organism);
CREATE INDEX IF NOT EXISTS idx_genes_domain ON genes(domain);
CREATE INDEX IF NOT EXISTS idx_genes_name ON genes(name);
CREATE INDEX IF NOT EXISTS idx_genes_accession ON genes(accession);
CREATE INDEX IF NOT EXISTS idx_genes_completeness ON genes(completeness);
CREATE INDEX IF NOT EXISTS idx_genes_length ON genes(length);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);

-- 启用行级安全
ALTER TABLE genes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- 基因表的安全策略（公开读取）
CREATE POLICY "基因数据公开读取"
  ON genes
  FOR SELECT
  TO public
  USING (true);

-- 用户资料表的安全策略
CREATE POLICY "用户可以查看自己的资料"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的资料"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的资料"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 搜索历史表的安全策略
CREATE POLICY "用户可以查看自己的搜索历史"
  ON search_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的搜索历史"
  ON search_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的搜索历史"
  ON search_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间触发器
CREATE TRIGGER update_genes_updated_at
  BEFORE UPDATE ON genes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();