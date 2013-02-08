<?php
$address = "127.0.0.1"; $user = "root"; $pass = "";
$conn = mysql_connect($address, $user, $pass);
$db_exists = mysql_select_db("chat");

$reset_pass = "res";
if (isset($_GET['pass']) && $_GET['pass'] == $reset_pass)
    mysql_query(" DROP DATABASE chat; ");

if ($conn && ! $db_exists) {
    mysql_query(" CREATE DATABASE chat; ");
    $db_exists = mysql_select_db("chat");
    mysql_query("
        CREATE TABLE messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sender VARCHAR(30),
            message VARCHAR(1000)
        );
    ", $conn);
}
?>
