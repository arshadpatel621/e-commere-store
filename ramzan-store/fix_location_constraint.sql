-- Add unique constraint to delivery_boy_id to enable UPSERT
ALTER TABLE public.delivery_locations ADD CONSTRAINT delivery_locations_delivery_boy_id_key UNIQUE (delivery_boy_id);
