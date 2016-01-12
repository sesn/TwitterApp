<?php 
require_once('../db/config.php');

$con = new config( DB_HOST, DB_USER, DB_PASS, DB_NAME );
$db = new Database($con);

$db->openConnection();

$postdata = file_get_contents("php://input");
$jsonHandle = new jsonHandler();
$requestdata = $jsonHandle->decode($postdata);



?>