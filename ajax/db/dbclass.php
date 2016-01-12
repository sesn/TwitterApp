<?php

/*Config class*/

class config {

	public $hostname;
	public $username;
	public $password;
	public $database;
	public $prefix; //Tp prevent SQL INnjection
	public $connector;

	/*Constructor Function*/
	function __construct($hostname = NULL, $username = NULL, $password = NULL, $database = NULL, $prefix = NULL, $connector = NULL) {
		$this->hostname = !empty($hostname) ? $hostname : "";
		$this->username = !empty($username) ? $username : "";
		$this->password = !empty($password) ? $password : "";
		$this->database = !empty($database) ? $database : "";
		$this->prefix = !empty($prefix) ? $prefix : "";
		$this->connector = !empty($connector) ? $connector : "mysqli";
	}

	/*Deconstructor Function*/
	function __destruct() {

	}
}

/*Database Class*/
class Database {

	private $connection;
	private $selectDb;
	private $lastQuery;
	private $config;

	function __construct($config) {
		$this->config = $config;
	}

	function __destruct() {

	}

	/*Creating a connection*/
	public function openConnection(){

		try {
			if($this->config->connector == "mysql") {
				$this->connection = mysql_connect($this->config->hostname, $this->config->username, $this->config->password);
				$this->selectDb = mysql_select_db($this->config->database);
			}
			elseif($this->config->connector == "mysqli") {
				$this->connection = new mysqli($this->config->hostname, $this->config->username, $this->config->password, $this->config->database);
				if($this->connection->connect_error) {
					echo "Failed to connect to Mysql Database due to ".$this->connection->connect_errno."--".$this->connection->connect_error;
					die();
				}
			}
		}
		catch(exception $e) {
			return $e;
		}

	}

	/*Closing a connection*/
	public function closeConnection() {

		try {
			if($this->config->connector == "mysql") {
				mysql_close($this->connection);
			}
			elseif($this->config->connector == "mysqli") {
				$this->connection->close();
			}
		}
		catch(exception $e) {
			return $e;
		}
	}

	/*Escape String Function starts here*/
	public function escapeString($string) {

		if($this->config->connector == "mysql") {
			return mysql_real_escape_string($string);
		}
		elseif($this->config->connector == "mysqli") {
			return $this->connection->real_escape_string($string);
		}

	}
	/*Escape String Function Ends here*/


	/*Query function*/
	public function query($query){
		//$query = str_replace("}", "",$query);
		//$query = str_replace("{",$this->config->prefix, $query);

		try {
			/*If the connection is empty, creating the new connection*/
			if(empty($this->connection)) {
				$this->openConnection();
				if($this->config->connector == "mysql") {
					$this->lastQuery = mysql_query($query);
				}
				elseif($this->config->connector == "mysqli") {
					$this->lastQuery = $this->connection->query($query);
				}

				return $this->lastQuery;
			}

			else {
				if($this->config->connector == "mysql") {
					$this->lastQuery = mysql_query($query);
				}
				elseif($this->config->connector == "mysqli") {
					$this->lastQuery = $this->connection->query($query);
				}

				return $this->lastQuery;
			}
		}

		catch(exception $e){
			return $e;
		}
	}
	/*Query Function here*/


	/*Function to get the last Query*/
	public function lastQuery() {
		return $this->lastQuery;
	}


	/*Function to fetch */
	public function fetchAssoc($result) {
		try{
			if($this->config->connector == "mysql") {
				return mysql_fetch_assoc($result);
			}
			elseif($this->config->connector == "mysqli") {
				return $result->fetch_assoc();
			}

		}
		catch(exception $e) {
			return $e;
		}
	}

	/*FUNCTION TO FETCHING ARRAY*/
	public function fetchArray($result) {
		try{
			if($this->config->connector == "mysql") {
				return mysql_fetch_array($result);
			}
			elseif($this->config->connector == "mysqli") {
				return $result->fetch_array();
			}
		}
		catch(exception $e) {
			return $e;
		}
	}
	
	/*Function to check whether the row is present or not*/
	/*Starts here*/

	public function hasRows($result)
	{
	    try
	    {
	        if($this->config->connector == "mysql")
	        {
	            if(mysql_num_rows($result)>0)
	            {
	                return true;
	            }
	            else
	            {
	                return false;
	            }
	        }
	        elseif($this->config->connector == "mysqli")
	        {
	            if(mysqli_num_rows($result)>0)
	            {
	                return true;
	            }
	            else
	            {
	                return false;
	            }
	        }
	    }
	    catch(exception $e)
	    {
	        return $e;
	    }
	}

	/*Ends here*/

	/*Function to count the number of rows*/
	public function countRows($result) {
		try{
			if($this->config->connector == "mysql") {
				return mysql_num_rows($result);
			}
			elseif($this->config->connector == "mysqli") {
				return $result->num_rows;
			}
		}
		catch(exception $e) {
			return $e;
		}
	}
	/*Count Function Ends*/

	/*Ping Server*/
	public function pingServer() {

		try {

			if($this->config->connector == "mysql") {
				if(!mysql_ping($this->connection)) {
					return false;
				}
				else {
					return true;
				}
			}

			elseif($this->config->connector == "mysqli") {
				if(!$this->connection->ping) {
					return false;
				}
				else {
					return true;
				}
			}

		}

		catch(exception $e) {
			return $e;
		}

	}
	/*Ping Server Ends*/

	/*INSERT TABLE WITH FIELD VALUES*/
	public function insertQuery($table, $field_values) {

		$query = "INSERT INTO ".$table." SET ". $field_values;


		try{

			/*Empty Connection*/
			if(empty($this->connection)) {
				$this->openConnection();
				if($this->config->connector == "mysql") {
					$this->lastQuery = mysql_query($query) ; 
				}
				elseif( $this->config->connector == "mysqli") {
					$this->lastQuery = mysqli_query($query);
				}

			}

			/*Non Empty Connection*/
			else {
				if($this->config->connector == "mysql") {
					$this->lastQuery = mysql_query($query) ; 
				}
				elseif( $this->config->connector == "mysqli") {
					$this->lastQuery = $this->connection->query($query);
				}
			}

		}

		catch(exception $e){

			return $e;

		}
	}

	/*UPDATE TABLE*/
	public function updateQuery($table, $field_values, $where) {
		
		$query = "UPDATE " . $table . "SET " . $field_values . " WHERE " . $where;

		try{

			/*Empty Connection*/
			if(empty($this->connection)) {
				$this->openConnection();
				if($this->config->connector == "mysql") {
					$this->lastQuery = mysql_query($query) ; 
				}
				elseif($this->config->connector == "mysqli") {
					$this->lastQuery = $this->connection->query($query);
				}

			}
			
			/*Non Empty Connection*/
			else {
				if($this->config->connector == "mysql") {
					$this->lastQuery = mysql_query($query) ; 
				}
				elseif($this->config->connector == "mysqli") {
					$this->lastQuery = $this->connection->query($query);
				}
			}

		}

		catch(exception $e) {
			return $e;
		}
		
	}


} /*Class Database Ends*/
?>