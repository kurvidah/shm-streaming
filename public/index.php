<?php
session_start();

// Check if the user is logged in, if not, redirect to login page
if (!isset($_SESSION['email'])) {
    header("Location: login.php");
    exit();
}

include './scripts/db.php'; // Include database connection

// Redirect non-admin users to the regular dashboard
if ($_SESSION['role_id'] > 2) {
    header("Location: ./app/user_dashboard.php");
    exit();
} else {
    header("Location: ./app/admin_dashboard.php");
    exit();
}
?>