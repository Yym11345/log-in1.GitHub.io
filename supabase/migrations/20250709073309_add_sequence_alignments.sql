-- 创建序列比对结果表
CREATE TABLE IF NOT EXISTS sequence_alignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    result jsonb NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX idx_sequence_alignments_user_id ON sequence_alignments(user_id);
CREATE INDEX idx_sequence_alignments_created_at ON sequence_alignments(created_at DESC);

-- 启用行级安全
ALTER TABLE sequence_alignments ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
CREATE POLICY "用户可以查看自己的序列比对结果"
    ON sequence_alignments
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的序列比对结果"
    ON sequence_alignments
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 创建更新时间触发器
CREATE TRIGGER update_sequence_alignments_updated_at
    BEFORE UPDATE ON sequence_alignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 