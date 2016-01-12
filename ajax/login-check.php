<?php
//header('Access-Control-Allow-Origin: *');
//header('Content-Type: application/json; charset = UTF-8');
//session_start();
require_once('db/config.php');

$con = new config( DB_HOST, DB_USER, DB_PASS, DB_NAME );
$db = new Database($con);

$db->openConnection();

$postdata = file_get_contents("php://input");
$jsonHandle = new jsonHandler();
$requestdata = $jsonHandle->decode($postdata);
//$requestdata = json_decode($postdata);
$userName = $db->escapeString($requestdata->userName);
$userPass = $db->escapeString($requestdata->userPass);

$data = array();


if(!empty($userName) && !empty($userPass)) {
	$query = $db->query("SELECT * FROM tbl_admin WHERE admin_user= '$userName' AND admin_pass = '$userPass'");

	if($db->hasRows($query)  > 0) {
		while($row = $db->fetchAssoc($query)) {
			if($row['admin_status'] == 1) {

				$_SESSION['user'] = $row['admin_user'];
				$_SESSION['loggedIn'] = true;

				$data['adminUser'] = $row['admin_user'];
				$data['adminType'] = $row['admin_type'];
				$data['adminMail'] = $row['admin_mail'];
				$data['adminContactMail'] = $row['admin_contactmail'];
				$data['loggedIn'] = true;

				
				/*Super admin*/
				if($row['admin_type'] == "sadmin")	{
					$data['message'] = "You have successfully connected and too have full access over the data";
				}
				else {
					$data['message'] = "You have successfully connected and have read-only access";
				}

				echo $jsonHandle->encode($data);

			}

			else {

				$_SESSION['user'] = $row['admin_user'];
				$_SESSION['loggedIn'] = false;

				$data['adminUser'] = $_SESSION['user'];
				$data['message'] = $data['adminUser'].", Your account has been deactivated. Please contact administrator";
				$data['loggedIn'] = false;

				echo $jsonHandle->encode($data);
			}
			
		}
	}
	else {
		$data['message'] = "User name or password is incorrect. Please provide authorised username and password. "; 
		$data['loggedIn'] = false;

		echo $jsonHandle->encode($data);
	}

}
else {
	$data['message'] = "Please enter the proper user name and password";
	$data['loggedIn'] = false; 
}

?>