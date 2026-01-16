-- ==========================================
-- FIX ADMIN PERMISSIONS
-- ==========================================

-- Allow Admins to UPDATE any profile (to promote/demote users)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Allow Admins to DELETE users if needed (optional but good practice)
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;
CREATE POLICY "Admins can delete any profile" ON public.profiles FOR DELETE USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
