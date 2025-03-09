<?php
session_start();

// Check if the user is logged in, if not, redirect to login page
if (!isset($_SESSION['email'])) {
    header("Location: login.php");
    exit();
}

include '../scripts/db.php'; // Include database connection

// Redirect non-admin users to the regular dashboard
if ($_SESSION['role_id'] > 2) {
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
    <title>SHM - Admin Dashboard</title>
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
</body>

</html>