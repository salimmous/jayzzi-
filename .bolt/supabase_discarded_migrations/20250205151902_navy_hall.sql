/*
  # Fix Authentication Setup
  
  1. Ensures proper user table structure
  2. Creates admin user with all required fields
  3. Sets up proper authentication identities
  4. Adds necessary metadata and security fields
*/

-- Create admin user with proper UUID generation
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
      confirmed_at,
      email_change_token_new,
      email_change_token_current
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
      now(),
      null,
      null
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
