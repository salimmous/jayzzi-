/*
  # Database Schema Update

  1. New Tables
    - articles
      - Stores article content and metadata
      - Links to auth.users for ownership
    - pins
      - Stores Pinterest pin data
      - Links to articles
    - keywords
      - Stores keyword research data

  2. Security
    - RLS enabled on all tables
    - Policies for authenticated users
    - Proper indexing for performance
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own articles" ON articles;
DROP POLICY IF EXISTS "Users can manage pins from their articles" ON pins;
DROP POLICY IF EXISTS "Users can manage keywords" ON keywords;

-- Create articles table if not exists
CREATE TABLE IF NOT EXISTS articles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    title text NOT NULL,
    sections jsonb,
    options jsonb,
    images text[],
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'rejected')),
    wordpress_draft boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create pins table if not exists
CREATE TABLE IF NOT EXISTS pins (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id uuid REFERENCES articles ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    image text,
    interests text[],
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create keywords table if not exists
CREATE TABLE IF NOT EXISTS keywords (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword text NOT NULL,
    volume integer DEFAULT 0,
    followers integer DEFAULT 0,
    popularity integer DEFAULT 0,
    position integer DEFAULT 0,
    change integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS articles_user_id_idx ON articles(user_id);
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status);
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles(created_at);

CREATE INDEX IF NOT EXISTS pins_article_id_idx ON pins(article_id);
CREATE INDEX IF NOT EXISTS pins_status_idx ON pins(status);
CREATE INDEX IF NOT EXISTS pins_created_at_idx ON pins(created_at);

CREATE INDEX IF NOT EXISTS keywords_keyword_idx ON keywords(keyword);
CREATE INDEX IF NOT EXISTS keywords_popularity_idx ON keywords(popularity);
CREATE INDEX IF NOT EXISTS keywords_position_idx ON keywords(position);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies
CREATE POLICY "Users can manage their own articles"
    ON articles
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage pins from their articles"
    ON pins
    FOR ALL
    USING (article_id IN (
        SELECT id FROM articles WHERE user_id = auth.uid()
    ))
    WITH CHECK (article_id IN (
        SELECT id FROM articles WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage keywords"
    ON keywords
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pins_updated_at ON pins;
CREATE TRIGGER update_pins_updated_at
    BEFORE UPDATE ON pins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_keywords_updated_at ON keywords;
CREATE TRIGGER update_keywords_updated_at
    BEFORE UPDATE ON keywords
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
