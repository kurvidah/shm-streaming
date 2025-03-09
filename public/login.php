<?php
include './scripts/db.php';

$message = "";
$toastClass = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $login_input = trim($_POST['login_input']); // This can be either email or username
    $password = $_POST['password']; // User-entered password

    // Prepare and execute user query to check both email and username
    $stmt = $conn->prepare("SELECT user_id, username, email, password FROM users WHERE email = ? OR username = ?");
    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ss", $login_input, $login_input);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user_id, $db_username, $db_email, $db_password);
        $stmt->fetch();
        // Fetch user role_id from users table
        $stmt_role = $conn->prepare("SELECT role_id FROM users WHERE user_id = ?");
        if (!$stmt_role) {
            die("Prepare failed: " . $conn->error);
        }

        $stmt_role->bind_param("i", $user_id); // Use the $user_id fetched from the users table
        $stmt_role->execute();
        $stmt_role->bind_result($role_id);
        $stmt_role->fetch();
        $stmt_role->close();

        // Verify hashed password
        if (password_verify($password, $db_password)) {
            $message = "Login successful";
            $toastClass = "bg-success";

            // Start the session and store user info
            session_start();
            $_SESSION['user_id'] = $user_id;
            $_SESSION['username'] = $db_username; // Store username
            $_SESSION['email'] = $db_email; // Store email
            $_SESSION['role_id'] = $role_id;

            // Redirect to home page
            header("Location: index.php");
            exit();
        } else {
            $message = "Incorrect password";
            $toastClass = "bg-danger";
        }
    } else {
        $message = "User not found";
        $toastClass = "bg-warning";
    }

    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
    <link rel="shortcut icon" href="https://cdn-icons-png.flaticon.com/512/295/295128.png">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="../css/login.css">
    <title>Login Page</title>
</head>

<body class="bg-light">
    <div class="container p-5 d-flex flex-column align-items-center">
        <?php if ($message): ?>
            <div class="toast align-items-center text-white 
            <?php echo $toastClass; ?> border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <?php echo $message; ?>
                    </div>
                    <button type="button" class="btn-close
                    btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        <?php endif; ?>
        <form action="" method="post" class="form-control mt-5 p-4" style="height:auto; width:380px; box-shadow: rgba(60, 64, 67, 0.3) 
            0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;">
            <div class="row">
                <i class="fa fa-user-circle-o fa-3x mt-1 mb-2" style="text-align: center; color: green;"></i>
                <h5 class="text-center p-4" style="font-weight: 700;">Login Into Your Account</h5>
            </div>
            <div class="col-mb-3">
                <label for="login_input"><i class="fa fa-user"></i> Username or Email</label>
                <input type="text" name="login_input" id="login_input" class="form-control" required>
            </div>
            <div class="col mb-3 mt-3">
                <label for="password"><i class="fa fa-lock"></i> Password</label>
                <input type="password" name="password" id="password" class="form-control" required>
            </div>
            <div class="col mb-3 mt-3">
                <button type="submit" class="btn btn-success bg-success" style="font-weight: 600;">Login</button>
            </div>
            <div class="col mb-2 mt-4">
                <p class="text-center" style="font-weight: 600; color: navy;"><a href="./register.php"
                        style="text-decoration: none;">Create Account</a> OR <a href="./resetpassword.php"
                        style="text-decoration: none;">Forgot Password</a></p>
            </div>
        </form>
    </div>
    <script>
        var toastElList = [].slice.call(document.querySelectorAll('.toast'))
        var toastList = toastElList.map(function (toastEl) {
            return new bootstrap.Toast(toastEl, { delay: 3000 });
        });
        toastList.forEach(toast => toast.show());
    </script>
</body>

</html>