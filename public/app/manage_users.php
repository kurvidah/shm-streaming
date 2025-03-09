<?php
session_start();

// Check if the user is logged in, if not, redirect to login page
if (!isset($_SESSION['email'])) {
    header("Location: login.php");
    exit();
}

include '../scripts/db.php'; // Include database connection

// Redirect non-admin users to the regular dashboard
if ($_SESSION['role_id'] !== 1) { // 1 = Admin
    header("Location: user_dashboard.php");
    exit();
}

// Handle delete user
if (isset($_GET['delete_user_id'])) {
    $delete_user_id = $_GET['delete_user_id'];
    $stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $delete_user_id);
    $stmt->execute();
    header("Location: manage_users.php");
    exit();
}

// Handle edit user
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['edit_user'])) {
    $user_id = $_POST['user_id'];
    $username = $_POST['username'];
    $email = $_POST['email'];
    $role_id = $_POST['role_id'];

    $stmt = $conn->prepare("UPDATE users SET username = ?, email = ? WHERE user_id = ?");
    $stmt->bind_param("ssi", $username, $email, $user_id);
    $stmt->execute();

    $stmt = $conn->prepare("UPDATE users SET role_id = ? WHERE user_id = ?");
    $stmt->bind_param("ii", $role_id, $user_id);
    $stmt->execute();

    header("Location: manage_users.php");
    exit();
}

// Fetch users and their roles
$query = "SELECT users.user_id, users.username, users.email, roles.role_name, users.role_id FROM users LEFT JOIN roles ON users.role_id = roles.role_id";
$result = $conn->query($query);
$users = $result->fetch_all(MYSQLI_ASSOC);

// Fetch roles
$roleQuery = "SELECT * FROM roles";
$roleResult = $conn->query($roleQuery);
$roles = $roleResult->fetch_all(MYSQLI_ASSOC);
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
        <h2>SHM - User Management</h2>

        <!-- Users Table -->
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($users as $user): ?>
                    <tr>
                        <td><?php echo $user['user_id']; ?></td>
                        <td><?php echo htmlspecialchars($user['username']); ?></td>
                        <td><?php echo htmlspecialchars($user['email']); ?></td>
                        <td><?php echo htmlspecialchars($user['role_name'] ?: 'User'); ?></td>
                        <td>
                            <button class="btn btn-warning btn-sm"
                                onclick="editUser(<?php echo $user['user_id']; ?>, '<?php echo htmlspecialchars($user['username']); ?>', '<?php echo htmlspecialchars($user['email']); ?>', <?php echo $user['role_id']; ?>)">Edit</button>
                            <a href="manage_users.php?delete_user_id=<?php echo $user['user_id']; ?>"
                                class="btn btn-danger btn-sm">Delete</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <!-- Edit User Modal -->
    <div id="editUserModal" class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form method="POST">
                        <input type="hidden" name="user_id" id="edit_user_id">
                        <div class="mb-3">
                            <label>Username:</label>
                            <input type="text" name="username" id="edit_username" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label>Email:</label>
                            <input type="email" name="email" id="edit_email" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label>Role:</label>
                            <select name="role_id" id="edit_role" class="form-control">
                                <?php foreach ($roles as $role): ?>
                                    <option value="<?php echo $role['role_id']; ?>"><?php echo $role['role_name']; ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <button type="submit" name="edit_user" class="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        function editUser(userId, username, email, roleId) {
            document.getElementById('edit_user_id').value = userId;
            document.getElementById('edit_username').value = username;
            document.getElementById('edit_email').value = email;
            document.getElementById('edit_role').value = roleId;
            new bootstrap.Modal(document.getElementById('editUserModal')).show();
        }
    </script>
</body>

</html>