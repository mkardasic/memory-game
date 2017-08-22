<?php
$servername = "localhost";
$username = "mkardasi_23";
$password = "jasamboba";
$dbname = "mkardasi_memory_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
   	header( 'Location: http://matejakardasic.com/memory_db_error.html' );
	ini_set("log_errors", 1);
	ini_set("error_log", "php-error.log");
	error_log( "getHighscores() --> connection failed, error: " . $conn->connect_error);
 die("Connection failed, please try again or report an error. " . $conn->connect_error);
}  

// Create SQL & fetch data
$sql = "SELECT player_name, player_score, player_time 
		FROM player_score
		ORDER BY player_score DESC, player_time ASC 
		LIMIT 5";
		
$result = $conn->query($sql);

// Create table
echo "<table class='tbl'>";
echo "<tr>
		<th class='tblHeader'>No.</th> 
		<th class='tblHeader'>Player</th>
		<th class='tblHeader'>Score</th> 
		<th class='tblHeader'>Time</th> 
	</tr>";

$ordinalNumber = 1;
	
if ($result->num_rows > 0) {
	
    // output data of each row
    while($row = $result->fetch_assoc()) {
		echo "<tr>
		 <td class='tblData'>".$ordinalNumber."</td>
		 <td class='tblData'>".$row["player_name"]."</td>
		 <td class='tblData'>".$row["player_score"]."</td>
		 <td class='tblData'>".$row["player_time"]."</td>
		 </tr>";
		
		$ordinalNumber++;
    }
} else {
    echo "0 results";
}

echo "</table>";

$conn->close();
?>