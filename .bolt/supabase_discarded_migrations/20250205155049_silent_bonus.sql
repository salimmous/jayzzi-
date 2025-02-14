-- Schema Export
\echo 'Exporting database schema and data...'

-- Drop existing tables if they exist
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS pins CASCADE;
DROP TABLE IF EXISTS keywords CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS shared_resources CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;

-- Create tables
CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  sections jsonb NOT NULL DEFAULT '[]',
  options jsonb NOT NULL DEFAULT '{}',
  images text[] DEFAULT array[]::text[],
  status text NOT NULL DEFAULT 'draft',
  wordpress_draft boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id),
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'processing', 'completed', 'rejected'))
);

CREATE TABLE images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  url text NOT NULL,
  folder text DEFAULT 'article_images',
  user_id uuid REFERENCES auth.users(id),
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE pins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image text NOT NULL,
  interests text[] DEFAULT array[]::text[],
  status text NOT NULL DEFAULT 'pending',
  user_id uuid REFERENCES auth.users(id),
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'rejected'))
);

CREATE TABLE keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  position integer DEFAULT 0,
  change integer DEFAULT 0,
  volume integer DEFAULT 0,
  followers integer DEFAULT 0,
  popularity integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  UNIQUE(keyword, user_id)
);

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

CREATE TABLE shared_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  resource_type text NOT NULL,
  resource_id uuid NOT NULL,
  permissions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'light',
  notifications jsonb DEFAULT '{"email": true, "push": false}'::jsonb,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Articles
CREATE POLICY "Users can access own articles" ON articles
  FOR ALL USING (user_id = auth.uid());

-- Images
CREATE POLICY "Users can access own images" ON images
  FOR ALL USING (user_id = auth.uid());

-- Pins
CREATE POLICY "Users can access own pins" ON pins
  FOR ALL USING (user_id = auth.uid());

-- Keywords
CREATE POLICY "Users can access own keywords" ON keywords
  FOR ALL USING (user_id = auth.uid());

-- Organizations
CREATE POLICY "Users can view organizations they belong to" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organizations.id
      AND user_id = auth.uid()
    )
  );

-- Organization Members
CREATE POLICY "Organization admins can manage members" ON organization_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organization_members.organization_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Shared Resources
CREATE POLICY "Users can access shared resources" ON shared_resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = shared_resources.organization_id
      AND user_id = auth.uid()
    )
  );

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- User Settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create default admin user
DO $$ 
DECLARE
  new_user_id uuid := gen_random_uuid();
  new_email varchar := 'admin@jizzyai.com';
BEGIN
  -- Only create if admin doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = new_email
  ) THEN
    -- Insert into auth.users
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      new_email,
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin"}',
      'authenticated',
      'authenticated'
    );

    -- Create profile
    INSERT INTO profiles (user_id, name)
    VALUES (new_user_id, 'Admin');

    -- Create settings
    INSERT INTO user_settings (user_id)
    VALUES (new_user_id);
  END IF;
END $$;
