<?php
include "db.php";
$data = json_decode(file_get_contents("php://input"));
$id = $conn->real_escape_string($data->userId);
$pass = $conn->real_escape_string($data->password);

$res = $conn->query("SELECT name FROM users WHERE id='$id' AND password='$pass'");
if ($res->num_rows > 0) {
    $row = $res->fetch_assoc();
    echo json_encode(["success" => true, "username" => $row['name']]);
} else {
    echo json_encode(["success" => false]);
}
?>
