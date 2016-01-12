<?php 

/*DATABASE CONFIGURATION*/
define('DB_HOST','localhost');
define('DB_USER','root');
define('DB_PASS','');
define('DB_NAME','twitter_tracking_tool');
	
/*SET SQL DB TO DEFAULT TIMEZONES OF USER*/
define('TIME_ZONE','Asia/Kolkata');

/*TWITTER CONFIGURATION*/
define('TWITTER_CONSUMER_KEY','DbkbW6Tl2lcAwRsxjTra6qmxe');
define('TWITTER_CONSUMER_SECRET','9ty7jBQWxg9SWguIxQeipIre8V1j2xqshYnuiCY5IaH5Q3G4Pg');
define('OAUTH_TOKEN','323837508-vadkoOj1p61Om3UUecLKoiANR2FtYID2jPP80AfX');
define('OAUTH_SECRET','e1LhwNqaZ4ZlWlBhYyaLAlMdPW7k5F4ktu4YPjVFLIGzg');

/*SETTINGS FOR MONITORING TWEETS*/
define('TWEET_ERROR_INTERVAL',10);
define('TWEET_ERROR_ADDRESS','*****');

/*BASE URL*/
define('BASE_URL','http://localhost/project/TwitterApp/');

date_default_timezone_set(TIME_ZONE);

require_once('dbclass.php');
require_once('jsonHandler.php');


?>