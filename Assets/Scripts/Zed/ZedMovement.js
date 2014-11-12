#pragma strict

/*
*  Script to control Zed’s Movement.
*/ 

var upperBody : GameObject;
var zedResources : ZedResources;

var maxSpeed : float;
var acceleration : float;
var deceleration : float;
var angularSpeed : float;
var upperBodyAngularSpeed : float;
var zedAnimator : Animator;
var animatorSpeedFactor : float;
var map : GameObject;

private var actualSpeed : float;
private var targetSpeed : float;

private var actualAngle : float;
private var targetAngle : float;

private var upperBodyTargetAngle : float;
private var upperBodyActualAngle : float;

private var accelerating : boolean;

private var _transform : Transform;
private var distanceCovered : float;
private var distanceSinceLastFootstep : float;
var distancePerFootstep : float;

var zedFootstepSound : AudioClip;

function Start() {
	// caching the Transform
	_transform = transform;
	distanceCovered = 0;
	distanceSinceLastFootstep = 0;
}

function FixedUpdate () {
	updateMovingState();
	rotateUpperBody();
	updateTransform();
	checkMapBounds();
	notifyAnimator();
}

private function updateMovingState() {	
	var axes : Vector2 = new Vector2(Input.GetAxis("Horizontal"), Input.GetAxis("Vertical"));
		
	targetSpeed = maxSpeed*Mathf.Min(axes.magnitude, 1.0);
	targetAngle = Mathf.Rad2Deg*Mathf.Atan2(axes.y, axes.x);
	
	var currentAcceleration : float = acceleration*Time.fixedDeltaTime;
	
	// modification by perks
	var activeMovementPerks : List.<MovementPerk> = zedResources.activePerks.getMovementPerks();
	for (var perk : MovementPerk in activeMovementPerks) {
		targetSpeed = targetSpeed * perk.getSpeedMultiplier();
		currentAcceleration = currentAcceleration * perk.getAccelerationMultiplier();
	}

	// Slow down if no keys pressed
	if (Mathf.Approximately(targetSpeed, 0)) {
		var currentDeceleration : float = deceleration*Time.fixedDeltaTime;
		if (Mathf.Abs(actualSpeed) > currentDeceleration) {
			actualSpeed -= currentDeceleration;
		} else {
			actualSpeed = 0;
		}
		
	// Accelerate
	} else {	
		var angleDifference = ZedUtils.getAngularDistance(actualAngle, targetAngle);
		actualAngle = ZedUtils.linearlyAdjustAngle(actualAngle, targetAngle, angularSpeed*Time.fixedDeltaTime);

		 
		var speedDifference = targetSpeed - actualSpeed;
		if (Mathf.Abs(speedDifference) > currentAcceleration) {
			actualSpeed += currentAcceleration*Mathf.Sign(speedDifference) ;
		} else {
			actualSpeed = targetSpeed;
		}
	}
	// Play Footstep sound, if zed moves some distance since his last footstep.
	if (distanceCovered > (distancePerFootstep + distanceSinceLastFootstep)) {
		AudioSource.PlayClipAtPoint(zedFootstepSound,transform.position);
		distanceSinceLastFootstep = distanceCovered;
	}
}

function rotateUpperBody() {
	// getting the mouse position relative to the world
	var mouseScreenPosition : Vector3 = Input.mousePosition;
	mouseScreenPosition.z = transform.position.z - Camera.main.transform.position.z;
	var mouseWorldPosition : Vector3 = Camera.main.ScreenToWorldPoint(mouseScreenPosition);
	
	
	// determining muzzle world position
	var positionDifference : Vector3 = mouseWorldPosition - transform.position;
	
	upperBodyTargetAngle = Mathf.Rad2Deg*Mathf.Atan2(positionDifference.y, positionDifference.x);
	upperBodyActualAngle = ZedUtils.proportionallyAdjustAngle(upperBodyActualAngle,
			upperBodyTargetAngle, upperBodyAngularSpeed*Time.fixedDeltaTime);
	
	upperBody.transform.eulerAngles = new Vector3(0, 0, upperBodyActualAngle);
}

function getUpperBodyAngle() {
	return upperBodyActualAngle;
}

private function checkMapBounds() {
	var yDirection : float;
	var xDirection : float;
	if (_transform.position.x < EnvironmentAttributes.mapBounds.min.x) {
		_transform.position.x = EnvironmentAttributes.mapBounds.min.x;
		setActualVelocityX(0);
		yDirection = Mathf.Sin(Mathf.Deg2Rad*targetAngle);
		if (!(Mathf.Abs(yDirection) < 0.01)) {
			yDirection = Mathf.Sign(yDirection);
		}
		setActualVelocityY(actualSpeed*Input.GetAxis("Vertical"));
	} else if (_transform.position.x > EnvironmentAttributes.mapBounds.max.x) {
		_transform.position.x = EnvironmentAttributes.mapBounds.max.x;
		setActualVelocityX(0);
		yDirection = Mathf.Sign(Mathf.Sin(Mathf.Deg2Rad*targetAngle));
		if (!(Mathf.Abs(yDirection) < 0.01)) {
			yDirection = Mathf.Sign(yDirection);
		}
		setActualVelocityY(actualSpeed*Input.GetAxis("Vertical"));
	} 
	if (_transform.position.y < EnvironmentAttributes.mapBounds.min.y) {
		_transform.position.y = EnvironmentAttributes.mapBounds.min.y;
		setActualVelocityY(0);
		xDirection = Mathf.Sign(Mathf.Cos(Mathf.Deg2Rad*targetAngle));
		if (!(Mathf.Abs(xDirection) < 0.01)) {
			xDirection = Mathf.Sign(xDirection);
		}
		setActualVelocityX(actualSpeed*Input.GetAxis("Horizontal"));
	} else if (_transform.position.y > EnvironmentAttributes.mapBounds.max.y) {
		_transform.position.y = EnvironmentAttributes.mapBounds.max.y;
		setActualVelocityY(0);
		xDirection = Mathf.Sign(Mathf.Cos(Mathf.Deg2Rad*targetAngle));
		if (!(Mathf.Abs(xDirection) < 0.01)) {
			xDirection = Mathf.Sign(xDirection);
		}
		setActualVelocityX(actualSpeed*Input.GetAxis("Horizontal"));
	}
}

function getCurrentVelocity() {
	return _transform.right*actualSpeed;
}

private function updateTransform() {
	_transform.rotation.eulerAngles = new Vector3(0, 0, actualAngle);
	var distanceCoveredAtFrame = Time.fixedDeltaTime*actualSpeed;
	distanceCovered += distanceCoveredAtFrame;
	_transform.position += _transform.right*distanceCoveredAtFrame;
}

private function notifyAnimator(){
	//zedAnimator.speed = animatorSpeedFactor*actualSpeed;
	zedAnimator.SetFloat("speed", actualSpeed);
}

function getDirection() : Vector2 {
	return new Vector2(Mathf.Cos(Mathf.Deg2Rad*actualAngle), 
			Mathf.Sin(Mathf.Deg2Rad*actualAngle));
}

function getAngle() : float {
	return actualAngle;
}

function getPosition() : Vector3 {
	return _transform.position;
}

function setActualVelocityX(val : float) {
	var actualVelocity : Vector2 = new Vector2(
			actualSpeed*Mathf.Cos(Mathf.Deg2Rad*actualAngle),
			actualSpeed*Mathf.Sin(Mathf.Deg2Rad*actualAngle));
	actualVelocity.x = val;
	actualSpeed = actualVelocity.magnitude;
	actualAngle = Mathf.Rad2Deg*Mathf.Atan2(actualVelocity.y, actualVelocity.x);
}

function setActualVelocityY(val : float) {
	var actualVelocity : Vector2 = new Vector2(
			actualSpeed*Mathf.Cos(Mathf.Deg2Rad*actualAngle),
			actualSpeed*Mathf.Sin(Mathf.Deg2Rad*actualAngle));
	actualVelocity.y = val;
	actualSpeed = actualVelocity.magnitude;
	actualAngle = Mathf.Rad2Deg*Mathf.Atan2(actualVelocity.y, actualVelocity.x);
}

function getDistanceCovered() : float {
	return distanceCovered;
}