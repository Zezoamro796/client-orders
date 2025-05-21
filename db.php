<?php
$conn = new mysqli("localhost", "root", "", "heba_orders");
$conn->set_charset("utf8");

if ($conn->connect_error) {
    die("فشل الاتصال: " . $conn->connect_error);
}
?>