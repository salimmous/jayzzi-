/*
  # Settings Management System

  1. Tables
    - `settings` table for storing encrypted API keys and configuration
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - Various encrypted API keys and configuration fields
      - Timestamps

  2. Security
    - Enable RLS on settings table
    - Encryption using pgsodium for sensitive data
    - Decrypted view with proper access control

  3. Features
    - Automatic encryption on insert/update
    - Secure decryption through view
    - Updated_at timestamp management
*/

-- Drop existing objects if they exist
DROP VIEW IF EXISTS decrypted_settings;
DROP TABLE IF EXISTS settings CASCADE;

-- Create settings table
CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  openai_key text,
  midjourney_key text,
  wordpress_url text,
  wordpress_token text,
  anthropic_key text,
  stability_key text,
  google_ai_key text,
  replicate_key text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own settings"
  ON settings
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for decrypted settings
CREATE VIEW decrypted_settings AS
SELECT
  s.id,
  s.user_id,
  pgp_sym_decrypt(s.openai_key::bytea, current_setting('app.settings_key')) as openai_key,
  pgp_sym_decrypt(s.midjourney_key::bytea, current_setting('app.settings_key')) as midjourney_key,
  s.wordpress_url,
  pgp_sym_decrypt(s.wordpress_token::bytea, current_setting('app.settings_key')) as wordpress_token,
  pgp_sym_decrypt(s.anthropic_key::bytea, current_setting('app.settings_key')) as anthropic_key,
  pgp_sym_decrypt(s.stability_key::bytea, current_setting('app.settings_key')) as stability_key,
  pgp_sym_decrypt(s.google_ai_key::bytea, current_setting('app.settings_key')) as google_ai_key,
  pgp_sym_decrypt(s.replicate_key::bytea, current_setting('app.settings_key')) as replicate_key,
  s.created_at,
  s.updated_at
FROM settings s
WHERE auth.uid() = s.user_id;

-- Create function to encrypt settings
CREATE OR REPLACE FUNCTION encrypt_settings()
RETURNS trigger AS $$
BEGIN
  IF NEW.openai_key IS NOT NULL THEN
    NEW.openai_key = pgp_sym_encrypt(NEW.openai_key, current_setting('app.settings_key'))::text;
  END IF;
  IF NEW.midjourney_key IS NOT NULL THEN
    NEW.midjourney_key = pgp_sym_encrypt(NEW.midjourney_key, current_setting('app.settings_key'))::text;
  END IF;
  IF NEW.wordpress_token IS NOT NULL THEN
    NEW.wordpress_token = pgp_sym_encrypt(NEW.wordpress_token, current_setting('app.settings_key'))::text;
  END IF;
  IF NEW.anthropic_key IS NOT NULL THEN
    NEW.anthropic_key = pgp_sym_encrypt(NEW.anthropic_key, current_setting('app.settings_key'))::text;
  END IF;
  IF NEW.stability_key IS NOT NULL THEN
    NEW.stability_key = pgp_sym_encrypt(NEW.stability_key, current_setting('app.settings_key'))::text;
  END IF;
  IF NEW.google_ai_key IS NOT NULL THEN
    NEW.google_ai_key = pgp_sym_encrypt(NEW.google_ai_key, current_setting('app.settings_key'))::text;
  END IF;
  IF NEW.replicate_key IS NOT NULL THEN
    NEW.replicate_key = pgp_sym_encrypt(NEW.replicate_key, current_setting('app.settings_key'))::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create encryption trigger
CREATE TRIGGER encrypt_settings_trigger
  BEFORE INSERT OR UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_settings();

-- Grant access to authenticated users
GRANT SELECT ON decrypted_settings TO authenticated;
GRANT ALL ON settings TO authenticated;
