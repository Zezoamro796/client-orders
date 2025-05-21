<?php
include "db.php";
$res = $conn->query("SELECT * FROM orders ORDER BY id DESC");
$orders = [];
while ($row = $res->fetch_assoc()) {
    $orders[] = $row;
}
echo json_encode($orders);
?>