<?php
include "db.php";
$name = $_POST['name'];
$phone = $_POST['phone'];
$address = $_POST['address'];
$product = $_POST['product'];
$username = $_POST['username'];

$image = "";
if (isset($_FILES['image'])) {
    $image = time() . "_" . $_FILES['image']['name'];
    move_uploaded_file($_FILES['image']['tmp_name'], "uploads/" . $image);
}

$conn->query("INSERT INTO orders (name, phone, address, product, image, username, created_at)
              VALUES ('$name', '$phone', '$address', '$product', '$image', '$username', NOW())");
?>