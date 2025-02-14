/*
  # Fix images table and RLS policies

  1. New Tables
    - `images`
      - `id` (uuid, primary key)
      - `url` (text)
      - `article_id` (uuid, foreign key)
      - `folder` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on `images` table
    - Add policies for authenticated users to:
      - Read their own images
      - Create new images
      - Update their own images
      - Delete their own images
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS images CASCADE;

-- Create images table
CREATE TABLE images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  folder text NOT NULL DEFAULT 'article_images',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

-- Enable RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own images"
  ON images
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create images"
  ON images
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images"
  ON images
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
  ON images
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_images_updated_at
  BEFORE UPDATE ON images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant access to authenticated users
GRANT ALL ON images TO authenticated;
