-- ==========================================
-- DUMMY DATA FOR DASHBOARD TESTING
-- ==========================================

-- 1. Insert Dummy Orders
INSERT INTO public.orders (customer_name, customer_email, total_amount, status, address_details, user_id)
VALUES 
('Aisha Khan', 'aisha@example.com', 450, 'Pending', '{"city": "Mumbai", "pincode": "400001", "fullAddress": "Flat 101, Sea View"}', auth.uid()),
('Rahul Sharma', 'rahul@example.com', 1200, 'Processing', '{"city": "Delhi", "pincode": "110001", "fullAddress": "12, MG Road"}', auth.uid()),
('Fatima Begum', 'fatima@example.com', 850, 'Delivered', '{"city": "Hyderabad", "pincode": "500001", "fullAddress": "H.No 5-4-321"}', auth.uid()),
('Zain Malik', 'zain@example.com', 2200, 'Pending', '{"city": "Bangalore", "pincode": "560001", "fullAddress": "Villa 45, Palm Grove"}', auth.uid()),
('Priya Singh', 'priya@example.com', 340, 'Cancelled', '{"city": "Pune", "pincode": "411001", "fullAddress": "B-203, Green Valley"}', auth.uid());

-- 2. Insert More Products (if needed)
INSERT INTO public.products (name, category, price, unit, stock_quantity, image, is_ramzan_special)
VALUES
('Iranian Dates', 'dates', 800, 'kg', 50, 'https://images.unsplash.com/photo-1558405967-4364366a36a9', true),
('Rose Syrup', 'beverages', 180, 'bottle', 100, 'https://m.media-amazon.com/images/I/61S+X3vN9+L.jpg', true),
('Almonds', 'dry_fruits', 1200, 'kg', 40, 'https://images.unsplash.com/photo-1508061253366-f7da158b6d90', false);
