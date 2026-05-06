-- Add user_id to tool_usages for per-account tracking
ALTER TABLE tool_usages ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Add index for user-based lookups
CREATE INDEX IF NOT EXISTS idx_tool_usages_user_tool ON tool_usages(user_id, tool);
