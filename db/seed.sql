USE mydatabase;

-- Insert sample users
INSERT INTO users (username, email, password_hash) VALUES
('alice', 'alice@example.com', '$2y$10$abcdefghijABCDEFGHIJabcdefghijABCDEFGHIJabcdefghijABCDEFGHIJ'),
('bob', 'bob@example.com', '$2y$10$abcdefghijABCDEFGHIJabcdefghijABCDEFGHIJabcdefghijABCDEFGHIJ'),
('charlie', 'charlie@example.com', '$2y$10$abcdefghijABCDEFGHIJabcdefghijABCDEFGHIJabcdefghijABCDEFGHIJ');

-- Insert sample posts
INSERT INTO posts (user_id, title, content) VALUES
(1, 'Alice\'s First Post', 'This is Alice\'s first post!'),
(1, 'Another Post by Alice', 'Alice is writing another post.'),
(2, 'Bob\'s Introduction', 'Hello, I\'m Bob! Nice to meet you all.'),
(3, 'Charlie\'s Thoughts', 'Here are some thoughts from Charlie.');