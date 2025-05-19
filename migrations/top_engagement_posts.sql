-- Migration file to create the top_engagement_posts table

-- Create the top_engagement_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS top_engagement_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id VARCHAR(100) NOT NULL,
  post_title VARCHAR(255) NOT NULL,
  post_image TEXT NOT NULL,
  post_type VARCHAR(20) CHECK (post_type IN ('feed', 'reel')) NOT NULL,
  post_date DATE NOT NULL,
  engagement_score DECIMAL(10, 2) NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  saved INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_top_engagement_score ON top_engagement_posts(engagement_score DESC);
CREATE INDEX IF NOT EXISTS idx_top_engagement_date ON top_engagement_posts(post_date DESC);

-- Insert sample data if no data exists
INSERT INTO top_engagement_posts (
  post_id, 
  post_title, 
  post_image, 
  post_type, 
  post_date, 
  engagement_score, 
  likes, 
  comments, 
  saved
)
SELECT 
  'sample123',
  'Novidades de Proteção X-ONE',
  'https://placehold.co/400x400/111827/FFFFFF/png?text=Post',
  'reel',
  CURRENT_DATE - INTERVAL '3 days',
  8.7,
  1245,
  83,
  56
WHERE NOT EXISTS (SELECT 1 FROM top_engagement_posts LIMIT 1);

-- Create a permission policy (if using Supabase Row Level Security)
ALTER TABLE top_engagement_posts ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to read data
CREATE POLICY "Anyone can read top_engagement_posts" 
ON top_engagement_posts FOR SELECT 
USING (true);

-- Add comments for documentation
COMMENT ON TABLE top_engagement_posts IS 'Stores information about posts with highest engagement metrics';
COMMENT ON COLUMN top_engagement_posts.engagement_score IS 'Overall engagement score as a percentage'; 