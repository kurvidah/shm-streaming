<?php
// Assuming you have stored the user's role in the session
$role_id = $_SESSION['role_id'];
$current_page = basename($_SERVER['PHP_SELF']);
?>

<nav class="navbar navbar-expand-sm navbar-light bg-success">
    <div class="container">
        <a class="navbar-brand" href="#" style="font-weight:bold; color:white;">SHM Streaming</a>
        <div>
            <?php if ($role_id == 1): // Admin ?>
                <a href="admin_dashboard.php"
                    class="btn btn-light <?php echo $current_page == 'admin_dashboard.php' ? 'disabled' : ''; ?>"
                    style="font-weight:bolder;color:green;">Admin Dashboard</a>
                <a href="manage_users.php"
                    class="btn btn-light <?php echo $current_page == 'manage_users.php' ? 'disabled' : ''; ?>"
                    style="font-weight:bolder;color:green;">Manage Users</a>
                <a href="manage_movies.php"
                    class="btn btn-light <?php echo $current_page == 'manage_movies.php' ? 'disabled' : ''; ?>"
                    style="font-weight:bolder;color:green;">Manage Movies</a>
            <?php elseif ($role_id == 2): // Moderator ?>
                <a href="manage_movies.php"
                    class="btn btn-light <?php echo $current_page == 'manage_movies.php' ? 'disabled' : ''; ?>"
                    style="font-weight:bolder;color:green;">Manage Movies</a>
            <?php endif; ?>
            <a href="user_dashboard.php"
                class="btn btn-light <?php echo $current_page == 'user_dashboard.php' ? 'disabled' : ''; ?>"
                style="font-weight:bolder;color:green;">User Dashboard</a>
            <a href="../scripts/logout.php" class="btn btn-light" style="font-weight:bolder;color:green;">Logout</a>
        </div>
    </div>
</nav>