<?php
$servername = "localhost";
$username = "mkardasi_23";
$password = "jasamboba";
$dbname = "mkardasi_memory_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
	ini_set("log_errors", 1);
	ini_set("error_log", "php-error.log");
	error_log( "insertScore() --> connection failed, error: " . $conn->connect_error);
    die("Connection failed, please try again or report an error. " . $conn->connect_error);
}  
// Get data from JS
$pn = $_POST['player_name'];
$ps = $_POST['player_score'];
$pt = $_POST['player_time'];

$sql = "INSERT INTO player_score(player_name, player_score, player_time, created_at) 
        VALUES ('$pn', '$ps', '$pt', current_timestamp)";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>