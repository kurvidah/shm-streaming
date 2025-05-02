USE shm_db;

-- Insert sample users
INSERT INTO users (user_id, username, email, password, role, gender, birthdate, region, created_at)
VALUES
(1, 'admin', 'admin@shm.app', '$2y$10$DIRJgsc.nuXFW3Z7xBMPiO3ZHuvctx/Kp1QbSYaz4sAu.djwNXGmO', 'ADMIN', NULL, NULL, NULL, '2025-01-01 00:00:00'), -- user : admin@shm.app, pass: admin
(2, 'mod', 'mod@shm.app', '$2y$10$p/wXLYeKnDtcb2LqoQJA6OLJq/mXO.CmfDKx67NCPq6tO7gR0AVN2', 'MODERATOR', NULL, NULL, NULL, '2025-02-20 12:30:00'), -- user : mod@shm.app, pass: mod
(3, 'bob_jones', 'bob.jones@mail.com', '$2a$12$1KtmoeGN/EPPBS92U/t9c.C5qbq2mlxf8.E9WYCDVdJ39jwJ7MDie', 'USER', 'Male', '2000-01-01', 'TH', '2025-01-15 08:00:00'); -- user : bob.jones@mail.com, pass: password

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
INSERT INTO movies (movie_id, title, poster, description, release_year, duration, is_available, imdb_id)
VALUES
(1, 'The Matrix', 'https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX300.jpg', 'A hacker discovers the world is a simulation.', 1999, 136, TRUE, 'tt0133093'),
(2, 'Inception', 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'A thief who steals corporate secrets through the use of dream-sharing technology.', 2010, 148, TRUE, 'tt1375666'),
(3, 'The Godfather', 'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_SX300.jpg', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 175, TRUE, 'tt0068646'),
(4, 'The Dark Knight', 'https://m.media-amazon.com/images/M/MV5BMTc3OTI2NjY0NF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.', 2008, 152, TRUE, 'tt0468569'),
(5, 'Pulp Fiction', 'https://m.media-amazon.com/images/M/MV5BMTc0NTI3NjY0NF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'The lives of two mob hitmen, a boxer, a gangster, and his wife intertwine in four tales of violence and redemption.', 1994, 154, TRUE, 'tt0110912'),
(6, 'Forrest Gump', 'https://m.media-amazon.com/images/M/MV5BMTYwNTI3NjY0NF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an IQ of 75.', 1994, 142, TRUE, 'tt0109830'),
(7, 'Fight Club', 'https://m.media-amazon.com/images/M/MV5BMTc1NTI3NjY0NF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.', 1999, 139, TRUE, 'tt0137523'),
(8, 'Interstellar', 'https://m.media-amazon.com/images/M/MV5BMTc2NTI3NjY0NF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.', 2014, 169, TRUE, 'tt0816692'),
(9, 'The Shawshank Redemption', 'https://m.media-amazon.com/images/M/MV5BMTc3NTI3NjY0NF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 1994, 142, TRUE, 'tt0111161'),
(10, 'The Avengers', 'https://m.media-amazon.com/images/M/MV5BMTc4NTI3NjY0NF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'Earths mightiest heroes must come together and learn to fight as a team if they are to stop the mischievous Loki and his alien army from enslaving humanity.', 2012, 143, TRUE, 'tt0848228'),
(11, 'Gladiator', 'https://m.media-amazon.com/images/M/MV5BMTc5NTI3NjY0NF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.', 2000, 155, TRUE, 'tt0172495'),
(12, 'The Lion King', 'https://m.media-amazon.com/images/M/MV5BMTgwNTI3NjY0NF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.', 1994, 88, TRUE, 'tt0110357'),
(13, 'The Silence of the Lambs', 'https://m.media-amazon.com/images/M/MV5BMTgxNTI3NjY0NF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to catch another serial killer, a madman who skins his victims.', 1991, 118, TRUE, 'tt0102926'),
(14, 'Schindlers List', 'https://m.media-amazon.com/images/M/MV5BMTgyNTI3NjY0NF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.', 1993, 195, TRUE, 'tt0108052');

INSERT INTO genres (genre_id, genre_description, genre_name)
VALUES
(1, 'Action', 'Action'),
(2, 'Drama', 'Drama'),
(3, 'Sci-Fi', 'Science Fiction'),
(4, 'Thriller', 'Thriller'),
(5, 'Comedy', 'Comedy'),
(6, 'Horror', 'Horror'),
(7, 'Romance', 'Romance'),
(8, 'Adventure', 'Adventure'),
(9, 'Fantasy', 'Fantasy'),
(10, 'Documentary', 'Documentary');

-- Insert sample media (for TV shows or episodes)
INSERT INTO media (media_id, movie_id, episode, season, description, upload_date, file_path, status)
VALUES
(1, 1, NULL, 1, 'Neo learns the truth about the Matrix.', '2025-01-01 12:00:00', '/media/matrix_episode1.mp4', 'APPROVED'),
(2, 1, 1, 1, 'Neo begins his training.', '2025-01-02 12:00:00', '/media/matrix_episode2.mp4', 'PENDING'),
(3, 2, NULL, 1,'Cobb assembles his team.', '2025-01-03 12:00:00', NULL, 'REJECTED'),
(4, 2, 3, 1,'The team enters the dream.', '2025-01-04 12:00:00', '/media/inception_episode2.mp4', 'APPROVED'),
(5, 3, NULL, 1,'The Corleone family faces challenges.', '2025-01-05 12:00:00', '/media/godfather_episode1.mp4', 'APPROVED');

INSERT INTO movie_genre (movie_id, genre_id)
VALUES
(1, 1),
(1, 3),
(2, 2),
(2, 4),
(3, 1),
(3, 2),
(3, 3);

-- Insert sample watch history
INSERT INTO watch_history (user_id, media_id, timestamp, watch_duration)
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