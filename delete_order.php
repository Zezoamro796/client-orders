<?php
include "db.php";
$id = intval($_GET['id']);
$conn->query("DELETE FROM orders WHERE id=$id");
?>