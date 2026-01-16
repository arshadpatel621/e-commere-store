-- ==========================================
-- MANUAL EMAIL CONFIRMATION
-- ==========================================

-- 1. Confirm your user manually
-- Replace 'arshadpatel1431@gmail.com' with your actual login email if different
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'arshadpatel1431@gmail.com';

-- 2. Verify it worked
SELECT email, email_confirmed_at, role FROM auth.users WHERE email = 'arshadpatel1431@gmail.com';
