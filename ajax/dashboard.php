<?php
require_once('db/config.php');

$con = new config( DB_HOST, DB_USER, DB_PASS, DB_NAME );
$db = new Database($con);

$db->openConnection();

$postdata = file_get_contents("php://input");
$jsonHandle = new jsonHandler();
$requestData = $jsonHandle->decode($postdata);

$data = array();

$page = $db->escapeString($requestData->page);
$innerPage = $db->escapeString($requestData->innerPage);

if($page == "dashboard") {
	$query = $db->query("SELECT * FROM tbl_hashtag");

	/*Overview Page*/
	if($innerPage == "overview" ) {

		/*Check whether it contains tha hashtag data or not*/
		if($db->hasRows($query)) {
			$data['hashtagArray'] = array();
			
			$i=0;
			while($row = $db->fetchAssoc($query)) {

				$hashtagName = $row['hashtagName'];
				/*Total Tweet Count*/
				$totTweetsQuery = $db->query("SELECT COUNT(DISTINCT tweet_id) FROM tweet_tags WHERE tag = '$hashtagName'");
				$totalTweets =  $db->fetchArray($totTweetsQuery);
				$data['hashtagArray'][$i]['hashtagName'] = $hashtagName;
				$data['hashtagArray'][$i]['tweets'] = array();
				//$tweetQuery = "SELECT * FROM tweet_tags LEFT JOIN"			
				$data['hashtagArray'][$i]['totalTweets'] = $totalTweets[0];
				$data['hashtagArray'][$i]['totalImpressions'] =  $i + 2000;
				$data['hashtagArray'][$i]['profileVisits'] = 3000;
				$data['hashtagArray'][$i]['totalMentions'] = 2000 - $i;
				$data['hashtagArray'][$i]['totalFollowers'] = 123121;

				$i++;
			}
			
			$data['destinationPage'] = "overview";
			$data['message'] = "The hashtag is present";
			
			echo $jsonHandle->encode($data);
				
		}

		else {

			$data['destinationPage'] = "add";
			$data['message'] = "please add the hashtag";
			
			echo $jsonHandle->encode($data);
			

		}
	}
	
	/*Add Hashtag Page*/
	elseif($innerPage == "add") {

		$hashTagName = $db->escapeString($requestData->hashTagName);
		$activationDateTime = $db->escapeString($requestData->activationDateTime);
		$activationDateTime = date("Y-m-d H:i:s",strtotime($activationDateTime));
		$createdBy = $db->escapeString($requestData->createdBy);
		$createdTime = $db->escapeString($requestData->createdTime);
		$createdTime = date("Y-m-d H:i:s",strtotime($createdTime));

		/*Local Server Time*/
		$localServerTime = date("d-M-y, h:i A");

		if(strtotime($activationDateTime) <= strtotime($localServerTime)) {
			$hashTagStatus = "1";
		}

		elseif(strtotime($activationDateTime) > strtotime($localServerTime)) {
			$hashTagStatus = "2";
		}

		if(!empty($hashTagName)) {

			$field_values = 'hashtagName = "'.$hashTagName.'", hashtagCreatedBy= "'.$createdBy.'", hashtagCreatedTime ="'.$createdTime.'", hashtagActivationTime = "'.$activationDateTime.'", hashtagStatus = "'.$hashTagStatus.'"';
			$db->insertQuery("tbl_hashtag", $field_values);

			$data['message'] = "The hashtag has been added";
			$data['destinationPage'] = "overview";

		}

		else {
			$data['message'] = "The hashtag has not been added";
		}


		echo $jsonHandle->encode($data);

	}
	
	elseif($innerPage == "delete") {
		$hashtagName = $db->escapeString($requestData->hashtagName);
		$query = $db->query("DELETE FROM tbl_hashtag WHERE hashtagName = '$hashtagName'");
		
		if($query) {
			$data['message'] = "You have successfully deleted.";	
		}
		else {
			$data['message'] = "deletion of hastag is failed";
		}
			
		echo $jsonHandle->encode($data);
	}


}






?>