-- 删除旧表（如果存在）
DROP TABLE IF EXISTS genes;
DROP TABLE IF EXISTS geness;

-- 创建新表
CREATE TABLE geness (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "Entry" text NOT NULL,
    "Reviewed" text NOT NULL,
    "Entry Name" text NOT NULL,
    "Protein names" text NOT NULL,
    "Gene Names" text,
    "EC number" text,
    "Organism" text NOT NULL,
    "Function" text,
    "Sequence" text,
    "Length" integer,
    "Domain" text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX idx_geness_entry ON geness("Entry");
CREATE INDEX idx_geness_entry_name ON geness("Entry Name");
CREATE INDEX idx_geness_protein_names ON geness("Protein names");
CREATE INDEX idx_geness_gene_names ON geness("Gene Names");
CREATE INDEX idx_geness_organism ON geness("Organism");
CREATE INDEX idx_geness_function ON geness("Function");

-- 启用 RLS
ALTER TABLE geness ENABLE ROW LEVEL SECURITY;

-- 创建公开读取策略
CREATE POLICY "基因数据公开读取"
    ON geness
    FOR SELECT
    TO public
    USING (true);

-- 创建触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_geness_updated_at
    BEFORE UPDATE ON geness
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 