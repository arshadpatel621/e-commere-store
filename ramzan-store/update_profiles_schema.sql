-- Add missing columns to the profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- Optional: Add a check constraint for phone number if needed (skipping for now for flexibility)
-- Optional: Add default values if needed
