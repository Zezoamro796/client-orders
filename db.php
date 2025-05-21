<?php
$conn = new mysqli("localhost", "db_user", "db_pass", "heba_orders");
$conn->set_charset("utf8");

if ($conn->connect_error) {
    die("فشل الاتصال: " . $conn->connect_error);
}
?>