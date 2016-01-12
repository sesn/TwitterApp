<?php

require('../db/config.php');
require_once('../libraries/phirehose/Phirehose.php');
require_once('../libraries/phirehose/OauthPhirehose.php');
class Consumer extends OauthPhirehose
{
  // A database connection is established at launch and kept open permanently
  public $oDB;
  public function db_connect() {
    require_once('db_lib.php');
    $this->oDB = new db;
  }
	
  // This function is called automatically by the Phirehose class
  // when a new tweet is received with the JSON data in $status
  public function enqueueStatus($status) {
    $tweet_object = json_decode($status);
		//echo $tweet_object;
		// Ignore tweets without a properly formed tweet id value
    if (!(isset($tweet_object->id_str))) { return;}
		
    $tweet_id = $tweet_object->id_str;

    $raw_tweet = base64_encode(serialize($tweet_object));
		
    $field_values = 'raw_tweet = "' . $raw_tweet . '", ' .
      'tweet_id = ' . $tweet_id;
    $this->oDB->insert('json_cache',$field_values);
  }
}

//Connection to the local database
$con = new config( DB_HOST, DB_USER, DB_PASS, DB_NAME );
$db = new Database($con);
$db->openConnection();

// Open a persistent connection to the Twitter streaming API
$stream = new Consumer(OAUTH_TOKEN, OAUTH_SECRET, Phirehose::METHOD_FILTER);

// Establish a MySQL database connection
$stream->db_connect();

$hashtagArray = array();
$query = $db->query('SELECT hashtagName FROM tbl_hashtag');
if($db->hasRows($query) > 0) {
	while($row = $db->fetchAssoc($query)) {
		array_push($hashtagArray,$row['hashtagName']);
	}
	//$stream->setTrack($hashtagArray);
}


$stream->setTrack(array('#IfCBIRaids'));


// Start collecting tweets
// Automatically call enqueueStatus($status) with each tweet's JSON data
$stream->consume();

?>