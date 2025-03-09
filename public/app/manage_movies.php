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

// Handle movie addition
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add_movie'])) {
    $title = $_POST['title'];
    $poster = $_POST['poster'];
    $description = $_POST['description'];

    $stmt = $conn->prepare("INSERT INTO movies (title, poster, description) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $title, $poster, $description);
    $stmt->execute();
    $stmt->close();
    header("Location: admin.php");
    exit();
}

// Handle movie deletion
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $stmt = $conn->prepare("DELETE FROM movies WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();
    header("Location: admin.php");
    exit();
}

// Fetch movies from the database
$query = "SELECT movie_id, title, poster, description FROM movies";
$result = $conn->query($query);
$movies = $result->fetch_all(MYSQLI_ASSOC);
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
    <title>SHM - Manage Movies</title>
</head>

<body>
    <?php include '../components/navbar.php'; ?>

    <div class="container mt-5">
        <h2>SHM - Manage Movies</h2>

        <!-- Add Movie Form -->
        <form method="POST" class="mb-4">
            <div class="mb-3">
                <label class="form-label">Title</label>
                <input type="text" name="title" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Poster URL</label>
                <input type="text" name="poster" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea name="description" class="form-control" required></textarea>
            </div>
            <button type="submit" name="add_movie" class="btn btn-success">Add Movie</button>
        </form>

        <!-- Movies Table -->
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Poster</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($movies as $movie): ?>
                    <tr>
                        <td><?php echo $movie['movie_id']; ?></td>
                        <td><?php echo htmlspecialchars($movie['title']); ?></td>
                        <td><img src="<?php echo htmlspecialchars($movie['poster']); ?>" width="50"></td>
                        <td><?php echo htmlspecialchars($movie['description']); ?></td>
                        <td>
                            <a href="?delete=<?php echo $movie['movie_id']; ?>" class="btn btn-danger btn-sm">Delete</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>

</html>