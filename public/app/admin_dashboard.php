<?php
session_start();

// Check if the user is logged in, if not, redirect to login page
if (!isset($_SESSION['email'])) {
    header("Location: login.php");
    exit();
}

include '../scripts/db.php'; // Include database connection

// Redirect non-admin users to the regular dashboard
if ($_SESSION['role_id'] !== 1) {
    header("Location: user_dashboard.php");
    exit();
}

// Fetch statistics from the database

// Total number of users
$total_users_query = "SELECT COUNT(*) AS total_users FROM users";
$total_users_result = $conn->query($total_users_query);
$total_users = $total_users_result->fetch_assoc()['total_users'];

// Total number of movies
$total_movies_query = "SELECT COUNT(*) AS total_movies FROM movies";
$total_movies_result = $conn->query($total_movies_query);
$total_movies = $total_movies_result->fetch_assoc()['total_movies'];

// Total number of active subscriptions
$total_active_subscriptions_query = "SELECT COUNT(*) AS total_active_subscriptions FROM user_subscription WHERE end_date > NOW()";
$total_active_subscriptions_result = $conn->query($total_active_subscriptions_query);
$total_active_subscriptions = $total_active_subscriptions_result->fetch_assoc()['total_active_subscriptions'];

// Total number of reviews
$total_reviews_query = "SELECT COUNT(*) AS total_reviews FROM reviews";
$total_reviews_result = $conn->query($total_reviews_query);
$total_reviews = $total_reviews_result->fetch_assoc()['total_reviews'];

// Total number of devices registered
$total_devices_query = "SELECT COUNT(*) AS total_devices FROM device";
$total_devices_result = $conn->query($total_devices_query);
$total_devices = $total_devices_result->fetch_assoc()['total_devices'];

// Total number of watch history entries
$total_watch_history_query = "SELECT COUNT(*) AS total_watch_history FROM watch_history";
$total_watch_history_result = $conn->query($total_watch_history_query);
$total_watch_history = $total_watch_history_result->fetch_assoc()['total_watch_history'];

// Total billing amount
$total_billing_query = "SELECT SUM(amount) AS total_billing FROM billing";
$total_billing_result = $conn->query($total_billing_query);
$total_billing = $total_billing_result->fetch_assoc()['total_billing'];

// Fetch users and their roles
$query = "SELECT users.user_id, users.username, users.email, roles.role_name, users.role_id FROM users LEFT JOIN roles ON users.role_id = roles.role_id";
$result = $conn->query($query);
$users = $result->fetch_all(MYSQLI_ASSOC);

// Fetch roles
$roleQuery = "SELECT * FROM roles";
$roleResult = $conn->query($roleQuery);
$roles = $roleResult->fetch_all(MYSQLI_ASSOC);

// Fetch Movie Rating
$moviesRatingQuery = "SELECT movies.movie_id, movies.title,
    COUNT(watch_history.movie_id) AS views,
    AVG(reviews.rating) AS average_rating
    FROM movies
    LEFT JOIN watch_history ON movies.movie_id = watch_history.movie_id
    LEFT JOIN reviews ON movies.movie_id = reviews.movie_id
    GROUP BY movies.movie_id;";
$moviesRatingResult = $conn->query($moviesRatingQuery);
$moviesRating = $moviesRatingResult->fetch_all(MYSQLI_ASSOC);

$billingSummaryQuery = "SELECT subscription_plan.plan_name, COUNT(*) AS total_subscriptions, FORMAT(SUM(billing.amount), 2) AS total_revenue
                        FROM billing
                        JOIN user_subscription ON billing.user_subscription_id = user_subscription.user_subscription_id
                        JOIN subscription_plan ON user_subscription.plan_id = subscription_plan.plan_id
                        WHERE billing.payment_status = 'Paid'
                        GROUP BY subscription_plan.plan_name";
$billingSummaryResult = $conn->query($billingSummaryQuery);
$billingSummary = $billingSummaryResult->fetch_all(MYSQLI_ASSOC);
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="stylesheet" href="../css/dashboard.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
    <link rel="shortcut icon" href="https://cdn-icons-png.flaticon.com/512/295/295128.png">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SHM - User Management</title>
</head>

<body>
    <?php include '../components/navbar.php'; ?>

    <div class="container mt-5">
        <h2>Admin Dashboard</h2>

        <div class="row">
            <!-- Total Users -->
            <div class="col-md-3 mb-4">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <h5 class="card-title">Total Users</h5>
                        <p class="card-text"><?php echo number_format($total_users); ?></p>
                    </div>
                </div>
            </div>

            <!-- Total Movies -->
            <div class="col-md-3 mb-4">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <h5 class="card-title">Total Movies</h5>
                        <p class="card-text"><?php echo number_format($total_movies); ?></p>
                    </div>
                </div>
            </div>

            <!-- Active Subscriptions -->
            <div class="col-md-3 mb-4">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <h5 class="card-title">Active Subscriptions</h5>
                        <p class="card-text"><?php echo number_format($total_active_subscriptions); ?></p>
                    </div>
                </div>
            </div>

            <!-- Total Reviews -->
            <div class="col-md-3 mb-4">
                <div class="card bg-danger text-white">
                    <div class="card-body">
                        <h5 class="card-title">Total Reviews</h5>
                        <p class="card-text"><?php echo number_format($total_reviews); ?></p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- Total Devices -->
            <div class="col-md-3 mb-4">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <h5 class="card-title">Total Devices</h5>
                        <p class="card-text"><?php echo number_format($total_devices); ?></p>
                    </div>
                </div>
            </div>

            <!-- Total Watch History -->
            <div class="col-md-3 mb-4">
                <div class="card bg-secondary text-white">
                    <div class="card-body">
                        <h5 class="card-title">Total Watch History</h5>
                        <p class="card-text"><?php echo number_format($total_watch_history); ?></p>
                    </div>
                </div>
            </div>

            <!-- Total Billing Amount -->
            <div class="col-md-3 mb-4">
                <div class="card bg-dark text-white">
                    <div class="card-body">
                        <h5 class="card-title">Total Billing Amount</h5>
                        <p class="card-text">$<?php echo number_format($total_billing, 2); ?></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container mt-5">
        <h2>Analytics Table</h2>

        <h4>Movies Rating</h4>

        <!-- Movies Rating -->
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Movie Title</th>
                    <th>Views</th>
                    <th>Ratings</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($moviesRating as $row): ?>
                    <tr>
                        <td><?php echo $row['movie_id']; ?></td>
                        <td><?php echo $row['title']; ?></td>
                        <td><?php echo $row['views']; ?></td>
                        <td><?php echo $row['average_rating']; ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <h4>Billing Summary</h4>

        <!-- Billing Summary -->
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Plan Name</th>
                    <th>Total Subscriptions</th>
                    <th>Total Revenue</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($billingSummary as $row): ?>
                    <tr>
                        <td><?php echo $row['plan_name']; ?></td>
                        <td><?php echo $row['total_subscriptions']; ?></td>
                        <td><?php echo $row['total_revenue']; ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>

</html>