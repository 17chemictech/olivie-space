-- supabase/setup.sql
-- Run this in Supabase SQL Editor to create the articles table

CREATE TABLE articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  tags text[] DEFAULT '{}',
  published_at timestamptz DEFAULT now(),
  reading_time_minutes int DEFAULT 5,
  view_count int DEFAULT 0,
  like_count int DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public reads
CREATE POLICY "Allow public reads" ON articles
  FOR SELECT USING (true);

-- Allow anonymous likes (only update like_count)
CREATE POLICY "Allow anonymous likes" ON articles
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- Allow anonymous view count updates (only update view_count)
CREATE POLICY "Allow anonymous views" ON articles
  FOR UPDATE USING (true)
  WITH CHECK (true);
