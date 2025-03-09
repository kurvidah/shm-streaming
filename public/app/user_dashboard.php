<?php
session_start();

// Check if the user is logged in, if not, redirect to login page
if (!isset($_SESSION['email'])) {
    header("Location: login.php");
    exit();
}

include '../scripts/db.php'; // Include database connection

// Fetch movies from the database
$query = "SELECT title, poster, description FROM movies";
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
    <title>SHM Dashboard</title>
</head>

<body>
    <?php include '../components/navbar.php'; ?>

    <div class="container mt-5">
        <h2>Welcome to SHM Streaming</h2>
        <div class="row mt-4">
            <?php foreach ($movies as $movie): ?>
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="<?php echo htmlspecialchars($movie['poster']); ?>" class="card-img-top"
                            alt="Movie Poster">
                        <div class="card-body">
                            <h5 class="card-title"> <?php echo htmlspecialchars($movie['title']); ?> </h5>
                            <p class="card-text"> <?php echo htmlspecialchars($movie['description']); ?> </p>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</body>

</html>