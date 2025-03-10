-- รายชื่อผู้ใช้และแผนสมัครสมาชิก
SELECT u.user_id, u.username, u.email, sp.plan_name, us.start_date, us.end_date
FROM users u
JOIN user_subscription us ON u.user_id = us.user_id
JOIN subscription_plan sp ON us.plan_id = sp.plan_id;

-- รายได้จากการสมัครสมาชิก
SELECT sp.plan_name, COUNT(b.billing_id) AS total_subscriptions, SUM(b.amount) AS total_revenue
FROM billing b
JOIN user_subscription us ON b.user_subscription_id = us.user_subscription_id
JOIN subscription_plan sp ON us.plan_id = sp.plan_id
WHERE b.payment_status = 'Paid'
GROUP BY sp.plan_name;

-- รายชื่อผู้ใช้ที่ยังไม่ได้จ่ายเงิน
SELECT u.user_id, u.username, u.email, b.amount, b.due_date
FROM users u
JOIN user_subscription us ON u.user_id = us.user_id
JOIN billing b ON us.user_subscription_id = b.user_subscription_id
WHERE b.payment_status = 'Pending' OR b.payment_status = 'Overdue';

-- จำนวนการดูภาพยนตร์ในแต่ละประเภท
SELECT m.genre, COUNT(wh.movie_id) AS total_views
FROM watch_history wh
JOIN movies m ON wh.movie_id = m.movie_id
GROUP BY m.genre
ORDER BY total_views DESC;

-- อุปกรณ์ที่ผู้ใช้ล็อกอินเข้าระบบ

SELECT d.device_type, COUNT(d.device_id) AS total_devices
FROM device d
GROUP BY d.device_type
ORDER BY total_devices DESC;

-- คะแนนรีวิวภาพยนตร์ที่ได้รับความนิยม
SELECT m.title, AVG(r.rating) AS average_rating, COUNT(r.review_id) AS total_reviews
FROM reviews r
JOIN movies m ON r.movie_id = m.movie_id
GROUP BY m.title
ORDER BY average_rating DESC, total_reviews DESC
LIMIT 10;

-- รายชื่อแอดมินทั้งหมดในระบบ
SELECT u.user_id, u.username, u.email
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id
JOIN roles r ON ur.role_id = r.role_id
WHERE r.role_name = 'Admin';