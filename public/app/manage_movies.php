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

// Handle movie addition
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add_movie'])) {
    $title = $_POST['title'];
    $poster = $_POST['poster'];
    $description = $_POST['description'];

    $stmt = $conn->prepare("INSERT INTO movies (title, poster, description) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $title, $poster, $description);
    $stmt->execute();
    header("Location: manage_movies.php");
    exit();
}

// Handle movie deletion
if (isset($_GET['delete'])) {
    $movie_id = $_GET['delete'];
    $stmt = $conn->prepare("DELETE FROM movies WHERE movie_id = ?");
    $stmt->bind_param("i", $movie_id);
    $stmt->execute();
    header("Location: manage_movies.php");
    exit();
}

// Handle movie editing
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['edit_movie'])) {
    $movie_id = $_POST['movie_id'];
    $title = $_POST['title'];
    $poster = $_POST['poster'];
    $description = $_POST['description'];

    $stmt = $conn->prepare("UPDATE movies SET title = ?, poster = ?, description = ? WHERE movie_id = ?");
    $stmt->bind_param("sssi", $title, $poster, $description, $movie_id);
    $stmt->execute();
    header("Location: manage_movies.php");
    exit();
}

// Fetch movies
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
                            <!-- Edit Button (opens modal) -->
                            <button class="btn btn-warning btn-sm"
                                onclick="editMovie(<?php echo $movie['movie_id']; ?>, '<?php echo htmlspecialchars($movie['title']); ?>', '<?php echo htmlspecialchars($movie['poster']); ?>', '<?php echo htmlspecialchars($movie['description']); ?>')">Edit</button>
                            <!-- Delete Button -->
                            <a href="?delete=<?php echo $movie['movie_id']; ?>" class="btn btn-danger btn-sm">Delete</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <!-- Edit Movie Modal -->
    <div id="editMovieModal" class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Movie</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form method="POST">
                        <input type="hidden" name="movie_id" id="edit_movie_id">
                        <div class="mb-3">
                            <label>Title:</label>
                            <input type="text" name="title" id="edit_title" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label>Poster URL:</label>
                            <input type="text" name="poster" id="edit_poster" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label>Description:</label>
                            <textarea name="description" id="edit_description" class="form-control" required></textarea>
                        </div>
                        <button type="submit" name="edit_movie" class="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Function to populate the modal with movie data for editing
        function editMovie(movieId, title, poster, description) {
            document.getElementById('edit_movie_id').value = movieId;
            document.getElementById('edit_title').value = title;
            document.getElementById('edit_poster').value = poster;
            document.getElementById('edit_description').value = description;
            new bootstrap.Modal(document.getElementById('editMovieModal')).show();
        }
    </script>
</body>

</html>