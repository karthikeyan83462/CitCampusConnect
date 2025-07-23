/*
  # Sample Data for CampusConnect

  1. Sample Data
    - Sample clubs across different categories
    - Sample canteen items with various categories
    - Sample hostel rooms for different blocks
    - Sample marketplace items

  2. Purpose
    - Provides initial data for testing and demonstration
    - Shows the application functionality with realistic content
    - Helps users understand the system capabilities
*/

-- Sample clubs
INSERT INTO clubs (name, description, category, member_count, is_active) VALUES
('Photography Club', 'Capture moments, create memories. Join us for photo walks, workshops, and exhibitions.', 'Arts', 45, true),
('Coding Club', 'Learn programming, participate in hackathons, and build amazing projects together.', 'Technical', 78, true),
('Drama Society', 'Express yourself through theater. We organize plays, skits, and acting workshops.', 'Cultural', 32, true),
('Basketball Team', 'Competitive basketball team representing our college in inter-college tournaments.', 'Sports', 15, true),
('Environmental Club', 'Working towards a greener campus and raising environmental awareness.', 'Social Service', 56, true),
('Music Band', 'Rock, pop, classical - we play it all! Join us for jam sessions and performances.', 'Cultural', 28, true),
('Robotics Club', 'Build robots, learn automation, and compete in robotics competitions.', 'Technical', 41, true),
('Literary Society', 'For book lovers, writers, and poetry enthusiasts. Monthly book discussions and writing contests.', 'Academic', 39, true),
('Dance Crew', 'Hip-hop, contemporary, classical - express yourself through dance.', 'Cultural', 33, true),
('Debate Club', 'Sharpen your speaking skills and engage in intellectual discussions.', 'Academic', 24, true);

-- Sample canteen items
INSERT INTO canteen_items (name, description, price, category, is_available) VALUES
-- Breakfast
('Masala Dosa', 'Crispy dosa with spiced potato filling, served with sambar and chutney', 45.00, 'Breakfast', true),
('Poha', 'Flattened rice with onions, peas, and aromatic spices', 25.00, 'Breakfast', true),
('Upma', 'Semolina breakfast dish with vegetables and curry leaves', 30.00, 'Breakfast', true),
('Paratha with Curd', 'Stuffed paratha served with fresh yogurt and pickle', 40.00, 'Breakfast', true),

-- Lunch
('Chicken Biryani', 'Fragrant basmati rice with tender chicken and aromatic spices', 120.00, 'Lunch', true),
('Dal Rice Combo', 'Yellow dal, steamed rice, pickle, and papad', 60.00, 'Lunch', true),
('Paneer Butter Masala', 'Creamy tomato-based curry with cottage cheese, served with rice/roti', 85.00, 'Lunch', true),
('Fish Curry', 'Spicy fish curry with coconut milk, served with rice', 95.00, 'Lunch', true),
('Rajma Rice', 'Kidney bean curry with steamed rice and salad', 70.00, 'Lunch', true),

-- Snacks
('Samosa', 'Crispy triangular pastry filled with spiced potatoes', 15.00, 'Snacks', true),
('Pav Bhaji', 'Spicy vegetable curry served with buttered bread rolls', 55.00, 'Snacks', true),
('Chaat', 'Tangy street food with crispy elements and chutneys', 35.00, 'Snacks', true),
('Sandwich', 'Grilled vegetable sandwich with cheese and chutney', 45.00, 'Snacks', true),
('Maggi', 'Instant noodles with vegetables and spices', 25.00, 'Snacks', true),

-- Beverages
('Masala Chai', 'Traditional Indian spiced tea', 10.00, 'Beverages', true),
('Coffee', 'Hot filter coffee with milk and sugar', 15.00, 'Beverages', true),
('Fresh Lime Water', 'Refreshing lime juice with mint and salt', 20.00, 'Beverages', true),
('Lassi', 'Creamy yogurt drink - sweet or salted', 25.00, 'Beverages', true),
('Cold Coffee', 'Iced coffee with milk and ice cream', 35.00, 'Beverages', true),

-- Desserts
('Gulab Jamun', 'Sweet milk dumplings in sugar syrup', 30.00, 'Desserts', true),
('Ice Cream', 'Vanilla, chocolate, or strawberry flavors', 25.00, 'Desserts', true),
('Kheer', 'Rice pudding with milk, sugar, and dry fruits', 35.00, 'Desserts', true),
('Jalebi', 'Crispy spiral-shaped sweet soaked in sugar syrup', 40.00, 'Desserts', true);

-- Sample hostel rooms
INSERT INTO hostel_rooms (block, room_number, capacity, occupied, is_available) VALUES
('A', '101', 2, 2, false),
('A', '102', 2, 1, true),
('A', '103', 2, 0, true),
('A', '201', 2, 2, false),
('A', '202', 2, 1, true),
('B', '101', 3, 2, true),
('B', '102', 3, 3, false),
('B', '103', 3, 1, true),
('B', '201', 3, 0, true),
('B', '202', 3, 2, true),
('C', '101', 2, 1, true),
('C', '102', 2, 0, true),
('C', '103', 2, 2, false),
('C', '201', 2, 1, true),
('C', '202', 2, 0, true);

-- Sample marketplace items
INSERT INTO marketplace_items (title, description, price, category, condition, seller_id, is_available) VALUES
('Engineering Mathematics Textbook', 'Complete set of engineering mathematics books for first year. Excellent condition with minimal highlighting.', 800.00, 'Books', 'like_new', null, true),
('HP Laptop i5 8th Gen', 'HP Pavilion laptop with Intel i5 processor, 8GB RAM, 256GB SSD. Perfect for coding and assignments.', 35000.00, 'Electronics', 'good', null, true),
('Study Table with Chair', 'Wooden study table with matching chair. Great for hostel room setup.', 2500.00, 'Furniture', 'good', null, true),
('Physics Lab Manual', 'Complete physics lab manual with all experiments and observations.', 150.00, 'Books', 'fair', null, true),
('Bluetooth Headphones', 'Sony WH-CH510 wireless headphones. Great sound quality for music and calls.', 2000.00, 'Electronics', 'like_new', null, true),
('Cricket Bat', 'Kashmir willow cricket bat, lightly used. Perfect for college matches.', 1200.00, 'Sports', 'good', null, true),
('Winter Jacket', 'Warm winter jacket, size L. Perfect for cold weather.', 800.00, 'Clothing', 'good', null, true),
('Programming Books Set', 'Complete set of C++, Java, and Python programming books.', 1500.00, 'Books', 'like_new', null, true),
('Mini Fridge', 'Small refrigerator perfect for hostel room. Energy efficient and quiet.', 8000.00, 'Electronics', 'good', null, true),
('Badminton Racket', 'Yonex badminton racket with cover. Excellent for recreational play.', 1800.00, 'Sports', 'like_new', null, true);