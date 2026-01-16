-- 1. Create Storage Bucket for Products
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Security Policies for Storage
-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow Admins to upload/update/delete
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' AND
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' AND
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
