-- PLACES
INSERT INTO places (name, city, category, description, rating) VALUES
  ('Golden Temple', 'Amritsar', 'religious', 'Most visited religious site in India.', 4.9),
  ('India Gate', 'Delhi', 'historical', 'Iconic war memorial in the heart of Delhi.', 4.7),
  ('Manali Old Town', 'Manali', 'natural', 'Beautiful mountain town in Himachal Pradesh.', 4.5),
  ('Chapora Fort', 'Goa', 'historical', 'Famous fort overlooking the Arabian Sea.', 4.3),
  ('Lal Bagh', 'Bangalore', 'natural', 'Beautiful botanical garden in the city.', 4.4),
  ('Varanasi Ghats', 'Varanasi', 'religious', 'Ancient ghats along the sacred Ganges river.', 4.8),
  ('Hawa Mahal', 'Jaipur', 'historical', 'Iconic palace of winds in the Pink City.', 4.6),
  ('Anjuna Beach', 'Goa', 'natural', 'Popular beach known for flea markets.', 4.2),
  ('Qutub Minar', 'Delhi', 'historical', 'UNESCO World Heritage minaret from 1193.', 4.5),
  ('Rishikesh Rafting Point', 'Rishikesh', 'adventure', 'White water rafting on the Ganges river.', 4.7);

-- COMPANIES
INSERT INTO companies (name) VALUES
  ('Google'), ('Microsoft'), ('Amazon'), ('TCS'), ('Infosys'),
  ('Wipro'), ('Accenture'), ('Deloitte'), ('Flipkart'), ('Zomato');

-- COLLEGES
INSERT INTO colleges (name) VALUES
  ('IIT Bombay'), ('IIT Delhi'), ('IIT Madras'), ('BITS Pilani'),
  ('Delhi University'), ('Manipal University'), ('VIT Vellore'),
  ('Amity University'), ('Symbiosis'), ('NIFT Delhi');

-- PROFILE OPTIONS
INSERT INTO profile_options (category, label, value) VALUES
  ('vibe', 'Chill', 'Chill'),
  ('vibe', 'Adventure', 'Adventure'),
  ('vibe', 'Party', 'Party'),
  ('vibe', 'Nature', 'Nature'),
  ('vibe', 'Road Trip', 'Road Trip'),
  ('budget', 'Shoestring (Budget)', 'Shoestring (Budget)'),
  ('budget', 'Mid-Range', 'Mid-Range'),
  ('budget', 'Luxury', 'Luxury');
