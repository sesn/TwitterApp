<?php 
require_once('db/config.php');

$postData = file_get_contents("php://input");
$data = array();

//OBJECTS OF CLASS
$con = new config( DB_HOST, DB_USER, DB_PASS, DB_NAME);
$jsonHandle = new jsonHandler();

$db->openConnection();
$requestData = $jsonHandle->decode($postData);

//POSTED DATA VARIABLES
$hashtagName = $db->escapeString($requestData->hashtagName);

if(!empty($hashtagName)) {
	$hashtagQuery = $db->query("SELECT * FROM ")
}

?>