<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,
initial-scale=1.0">
    <title>Manage Media</title>
</head>
<form action="action_page.php" method="post">
    <h1>Login Page</h1>
    <nav>
        <a href="index.php">Dashboard</a> |
        <a href="manage_media.php">Manage Media</a> |
        <a href="reports.php">View Reports</a> |
        <a href="login.php">Logout</a>
    </nav>

    <div class="container">
        <label for="uname"><b>Username</b></label>
        <input type="text" placeholder="Enter Username" name="uname" required>

        <label for="psw"><b>Password</b></label>
        <input type="password" placeholder="Enter Password" name="psw" required>

        <button type="submit">Login</button>
        <label>
            <input type="checkbox" checked="checked" name="remember"> Remember me
        </label>
    </div>

    <div class="container" style="background-color:#f1f1f1">
        <button type="button" class="cancelbtn">Cancel</button>
        <span class="psw">Forgot <a href="#">password?</a></span>
    </div>
</form>

</html>