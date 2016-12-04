<?php

class GeoLocation {
//Originally from https://github.com/anthonymartin/GeoLocation.php

	private $radLat;  // latitude in radians
	private $radLon;  // longitude in radians

	private $degLat;	 // latitude in degrees
	private $degLon;  // longitude in degrees

	private $angular; // angular radius

	const EARTHS_RADIUS_KM = 6371.01;
	const EARTHS_RADIUS_MI = 3958.762079;

	protected static $MIN_LAT;  // -PI/2
	protected static $MAX_LAT;  //  PI/2
	protected static $MIN_LON;  // -PI
	protected static $MAX_LON;  //  PI

	public function __construct() {
		self::$MIN_LAT = deg2rad(-90);   // -PI/2
		self::$MAX_LAT = deg2rad(90);    //  PI/2
		self::$MIN_LON = deg2rad(-180);  // -PI
		self::$MAX_LON = deg2rad(180);   //  PI
	}

	/**
	 * @param double $latitude the latitude, in degrees.
	 * @param double $longitude the longitude, in degrees.
	 * @return GeoLocation
	 */
	public static function fromDegrees($latitude, $longitude) {
		$location = new GeoLocation();
		$location->radLat = deg2rad($latitude);
		$location->radLon = deg2rad($longitude);
		$location->degLat = $latitude;
		$location->degLon = $longitude;
		$location->checkBounds();
		return $location;
	}


	public static function fromRadians($latitude, $longitude) {
		$location = new GeoLocation();
		$location->radLat = $latitude;
		$location->radLon = $longitude;
		$location->degLat = rad2deg($latitude);
		$location->degLon = rad2deg($longitude);
		$location->checkBounds();
		return $location;
	}

	protected function checkBounds() {
		if ($this->radLat < self::$MIN_LAT || $this->radLat > self::$MAX_LAT ||
				$this->radLon < self::$MIN_LON || $this->radLon > self::$MAX_LON)
			throw new \Exception("Invalid Argument");
	}

  /**
   * Computes the great circle distance between this GeoLocation instance
   * and the location argument.
   * @param GeoLocation $location
   * @param string $unit_of_measurement
   * @internal param float $radius the radius of the sphere, e.g. the average radius for a
   * spherical approximation of the figure of the Earth is approximately
   * 6371.01 kilometers.
   * @return double the distance, measured in the same unit as the radius
   * argument.
   */
	public function distanceTo(GeoLocation $location, $unit_of_measurement) {
		$radius = $this->getEarthsRadius($unit_of_measurement);

		return acos(sin($this->radLat) * sin($location->radLat) +
					cos($this->radLat) * cos($location->radLat) *
					cos($this->radLon - $location->radLon)) * $radius;
	}

	/**
	 * @return double the latitude, in degrees.
	 */
	public function getLatitudeInDegrees() {
		return $this->degLat;
	}

	/**
	 * @return double the longitude, in degrees.
	 */
	public function getLongitudeInDegrees() {
		return $this->degLon;
	}

	/**
	 * @return double the latitude, in radians.
	 */
	public function getLatitudeInRadians() {
		return $this->radLat;
	}

	/**
	 * @return double the longitude, in radians.
	 */
	public function getLongitudeInRadians() {
		return $this->radLon;
	}

	/**
	 * @return double angular radius.
	 */
	public function getAngular() {
		return $this->angular;
	}

	public function __toString() {
		return "(" . $this->degLat . ", " . $this->degLon . ") = (" .$this->radLat . " rad, " . $this->radLon . " rad";
	}



	public function boundingCoordinates($distance, $unit_of_measurement) {
		$radius = $this->getEarthsRadius($unit_of_measurement);
		if ($radius < 0 || $distance < 0) throw new \Exception('Arguments must be greater than 0.');

		// angular distance in radians on a great circle
		$this->angular = $distance / $radius;

		$minLat = $this->radLat - $this->angular;
		$maxLat = $this->radLat + $this->angular;

		$minLon = 0;
		$maxLon = 0;
		if ($minLat > self::$MIN_LAT && $maxLat < self::$MAX_LAT) {
			$deltaLon = asin(sin($this->angular) /
				cos($this->radLat));
			$minLon = $this->radLon - $deltaLon;
			if ($minLon < self::$MIN_LON) $minLon += 2 * pi();
			$maxLon = $this->radLon + $deltaLon;
			if ($maxLon > self::$MAX_LON) $maxLon -= 2 * pi();
		} else {
			// a pole is within the distance
			$minLat = max($minLat, self::$MIN_LAT);
			$maxLat = min($maxLat, self::$MAX_LAT);
			$minLon = self::$MIN_LON;
			$maxLon = self::$MAX_LON;
		}

		return array(
			GeoLocation::fromRadians($minLat, $minLon),
			GeoLocation::fromRadians($maxLat, $maxLon)
		);
	}

	protected function getEarthsRadius($unit_of_measurement) {
		$u = $unit_of_measurement;
		if($u == 'miles' || $u == 'mi')
			return $radius = self::EARTHS_RADIUS_MI;
		elseif($u == 'kilometers' || $u == 'km')
			return $radius = self::EARTHS_RADIUS_KM;

		else throw new \Exception('You must supply a valid unit of measurement');
	}
	/**
	 *  Retrieves Geocoding information from Google
	 *  eg. $response = GeoLocation::getGeocodeFromGoogle($location);
	 *		$latitude = $response->results[0]->geometry->location->lng;
	 *	    $longitude = $response->results[0]->geometry->location->lng;
	 *	@param string $location address, city, state, etc.
	 *	@return \stdClass
	 */
	public static function getGeocodeFromGoogle($location) {
		$url = 'http://maps.googleapis.com/maps/api/geocode/json?address='.urlencode($location).'&sensor=false';

		$ch = curl_init();
	    curl_setopt($ch, CURLOPT_URL,$url);
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	    return json_decode(curl_exec($ch));
	}
	public static function MilesToKilometers($miles) {
		return $miles * 1.6093439999999999;
	}
	public static function KilometersToMiles($km) {
		return $km * 0.621371192237334;
	}
}



function isWithinCircle(GeoLocation $location, GeoLocation $center, $distance, $unitOfMeasurement = 'km') {
        $range = $center->distanceTo($location, $unitOfMeasurement);
        return $range < $distance;

}

/**
 * Checks if the $location is inside a "square" with edge length 2*$distance centered at $center
 *
 */
function isWithinTheFence(GeoLocation $location, GeoLocation $center, $distance, $unitOfMeasurement = 'km') {
    $inRange = isWithinCircle($location, $center, $distance, $unitOfMeasurement);
		// if(isset($inRange)){echo "The value is set as:";}
		if($inRange == 1 ){echo "The location is within the fence...\n<br>";}

    // need to check the bounds to make the region "square"
    if(!$inRange) {
        list($min, $max) = $center->boundingCoordinates($distance, $unitOfMeasurement);
        $inRange = $min -> getLatitudeInDegrees() <= $location->getLatitudeInDegrees();
        $inRange = $inRange && $min->getLongitudeInDegrees() <= $location->getLongitudeInDegrees();
        $inRange = $inRange && $max->getLatitudeInDegrees() >= $location->getLatitudeInDegrees();
        $inRange = $inRange && $min->getLongitudeInDegrees() >= $location->getLongitudeInDegrees();
    }

    return $inRange ;
}


$center = GeoLocation::fromDegrees(24.954072, 67.071324);
$myLocation = GeoLocation::fromDegrees(24.955112, 67.071418);
$inRange = isWithinTheFence($myLocation, $center, 1, 'km');

?>
