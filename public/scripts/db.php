<?php
$servername = 'db';
$username = $_ENV["DB_USER"];
$password = $_ENV["DB_PASS"];
$dbname = 'shmdb';
$dbport = '3306';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $dbport);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>