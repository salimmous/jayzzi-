/*
  # Fix Authentication Setup
  
  1. Ensures proper user table structure
  2. Creates admin user with all required fields
  3. Sets up proper authentication identities
  4. Adds necessary metadata and security fields
*/

-- First, ensure the auth schema exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Create auth tables if they don't exist
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY,
  instance_id uuid,
  email text UNIQUE,
  encrypted_password text,
  email_confirmed_at timestamptz,
  invited_at timestamptz,
  confirmation_token text,
  confirmation_sent_at timestamptz,
  recovery_token text,
  recovery_sent_at timestamptz,
  email_change_token_new text,
  email_change text,
  email_change_sent_at timestamptz,
  last_sign_in_at timestamptz,
  raw_app_meta_data jsonb,
  raw_user_meta_data jsonb,
  is_super_admin boolean,
  created_at timestamptz,
  updated_at timestamptz,
  phone text,
  phone_confirmed_at timestamptz,
  phone_change text,
  phone_change_token text,
  phone_change_sent_at timestamptz,
  confirmed_at timestamptz,
  email_change_token_current text,
  email_change_confirm_status smallint,
  banned_until timestamptz,
  reauthentication_token text,
  reauthentication_sent_at timestamptz,
  is_sso_user boolean DEFAULT false,
  deleted_at timestamptz,
  aud text,
  role text
);

CREATE TABLE IF NOT EXISTS auth.identities (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  identity_data jsonb NOT NULL,
  provider text NOT NULL,
  provider_id text,
  last_sign_in_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  email text
);

-- Create admin user
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
    -- Insert into auth.users with all required fields
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      is_super_admin,
      phone,
      confirmed_at
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      new_email,
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin"}',
      'authenticated',
      'authenticated',
      now(),
      now(),
      encode(gen_random_bytes(32), 'hex'),
      encode(gen_random_bytes(32), 'hex'),
      false,
      null,
      now()
    );

    -- Insert into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at,
      email
    ) VALUES (
      gen_random_uuid(),
      new_user_id,
      jsonb_build_object(
        'sub', new_user_id,
        'email', new_email
      ),
      'email',
      new_email,
      now(),
      now(),
      now(),
      new_email
    );
  END IF;
END $$;
