USE shmdb;

-- Insert sample users
INSERT INTO users (user_id, username, email, password, gender, age, religion, created_at)
VALUES
(1, 'john_doe', 'john.doe@example.com', 'password123', 'Male', 30, 'Christianity', '2025-03-01 10:00:00'),
(2, 'jane_smith', 'jane.smith@example.com', 'password123', 'Female', 25, 'Atheist', '2025-02-20 12:30:00'),
(3, 'bob_jones', 'bob.jones@example.com', 'password123', 'Male', 35, 'Hindu', '2025-01-15 08:00:00');

-- Insert sample roles
INSERT INTO roles (role_id, role_name)
VALUES
(1, 'Admin'),
(2, 'User'),
(3, 'Moderator');

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id)
VALUES
(1, 1), -- John is an Admin
(2, 2), -- Jane is a User
(3, 3); -- Bob is a Moderator

-- Insert sample subscription plans
INSERT INTO subscription_plan (plan_id, plan_name, price, max_devices, hd_available, ultra_hd_available, duration_days)
VALUES
(1, 'Basic Plan', 9.99, 1, TRUE, FALSE, 30),
(2, 'Standard Plan', 14.99, 3, TRUE, TRUE, 30),
(3, 'Premium Plan', 19.99, 5, TRUE, TRUE, 30);

-- Insert sample user subscriptions
INSERT INTO user_subscription (user_subscription_id, user_id, plan_id, start_date, end_date)
VALUES
(1, 1, 2, '2025-03-01 10:00:00', '2025-03-31 10:00:00'),
(2, 2, 1, '2025-02-20 12:30:00', '2025-03-20 12:30:00'),
(3, 3, 3, '2025-01-15 08:00:00', '2025-02-14 08:00:00');

-- Insert sample billings
INSERT INTO billing (billing_id, user_subscription_id, amount, payment_method, payment_date, due_date, payment_status)
VALUES
(1, 1, 14.99, 'Credit Card', '2025-03-01 10:00:00', '2025-03-15 10:00:00', 'Paid'),
(2, 2, 9.99, 'PayPal', '2025-02-20 12:30:00', '2025-03-05 12:30:00', 'Unpaid'),
(3, 3, 19.99, 'Credit Card', '2025-01-15 08:00:00', '2025-02-01 08:00:00', 'Paid');

-- Insert sample movies
INSERT INTO movies (movie_id, title, poster, description, release_year, genre, duration, is_available, imdb_id)
VALUES
(1, 'The Matrix', 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX300.jpg', 'A hacker discovers the world is a simulation.', 1999, 'Sci-Fi', 136, TRUE, 'tt0133093'),
(2, 'Inception', 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'A thief who steals corporate secrets through the use of dream-sharing technology.', 2010, 'Sci-Fi', 148, TRUE, 'tt1375666'),
(3, 'The Godfather', 'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_SX300.jpg', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 'Crime', 175, TRUE, 'tt0068646');

-- Insert sample watch history
INSERT INTO watch_history (user_id, movie_id, timestamp, watch_duration)
VALUES
(1, 1, '2025-03-02 14:00:00', 120),
(2, 2, '2025-02-21 16:00:00', 148),
(3, 3, '2025-01-20 19:00:00', 175);

-- Insert sample reviews
INSERT INTO reviews (review_id, user_id, movie_id, rating, review_text, review_date)
VALUES
(1, 1, 1, 5, 'Amazing movie, mind-blowing concept!', '2025-03-02 16:00:00'),
(2, 2, 2, 4, 'Great movie, but the ending was confusing.', '2025-02-21 18:00:00'),
(3, 3, 3, 5, 'A classic, the best film of all time.', '2025-01-20 20:00:00');

-- Insert sample devices
INSERT INTO device (device_id, user_id, device_type, device_name, registered_at)
VALUES
(1, 1, 'Phone', 'iPhone 12', '2025-03-01 10:30:00'),
(2, 2, 'Laptop', 'MacBook Pro', '2025-02-20 13:00:00'),
(3, 3, 'TV', 'Samsung Smart TV', '2025-01-18 09:00:00');

-- Insert sample media (for TV shows or episodes)
INSERT INTO media (media_id, movie_id, episode, description)
VALUES
(1, 2, 1, 'Episode 1: Dream Extraction'),
(2, 2, 2, 'Episode 2: The Heist'),
(3, 2, 3, 'Episode 3: The Finale');