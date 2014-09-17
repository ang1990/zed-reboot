/*
 * Controls the smooth movement of the camera. Is bounded by the map. Can be attached to any other object than Zed as well.
 */

#pragma strict

var target : Transform;

private var leftBound : float;
private var rightBound : float;
private var topBound : float;
private var bottomBound : float;

private var cameraSpeedX : float;
private var cameraSpeedY : float;
var acceleration : float;
var damping : float;
var mouseInfluenceWeight : float;

private var shakeIntensity : float;

function Start(){
	leftBound = EnvironmentAttributes.mapBounds.min.x + (Camera.main.orthographicSize * Camera.main.aspect);	
	rightBound =  EnvironmentAttributes.mapBounds.max.x - (Camera.main.orthographicSize * Camera.main.aspect);	
	bottomBound = EnvironmentAttributes.mapBounds.min.y + Camera.main.orthographicSize;	
	topBound = EnvironmentAttributes.mapBounds.max.y - Camera.main.orthographicSize;
}

// Function to induce camera shake during explosions, etc.
// Set 0.05 for average-sized explosions.

function induceShake(amount : float) {
	shakeIntensity = amount;
}

function Update () {
	var zedPosition : Vector3 = target.position;
	var camPosition : Vector3 = transform.position;
	
	if (Input.GetKeyDown("h")) {
		induceShake(0.05);
	}
	
	var mouseScreenPosition : Vector3 = Input.mousePosition;
	mouseScreenPosition.z = -transform.position.z;
	var mouseWorldPosition : Vector3 = Camera.main.ScreenToWorldPoint(mouseScreenPosition);	
	
	var targetPosition : Vector3 = (1 - mouseInfluenceWeight)*zedPosition + mouseInfluenceWeight*mouseWorldPosition;
	
	if (targetPosition.x < leftBound) targetPosition.x = leftBound;
	if (targetPosition.x > rightBound) targetPosition.x = rightBound;
	if (targetPosition.y > topBound) targetPosition.y = topBound;
	if (targetPosition.y < bottomBound) targetPosition.y = bottomBound;
	
	var delta : Vector3 = (targetPosition - camPosition);
	cameraSpeedX += acceleration*delta.x*Time.deltaTime;
	cameraSpeedY += acceleration*delta.y*Time.deltaTime;
	cameraSpeedX *= Mathf.Exp(-damping*Time.deltaTime);
	cameraSpeedY *= Mathf.Exp(-damping*Time.deltaTime);

	transform.position += (new Vector3(cameraSpeedX*Time.deltaTime, cameraSpeedY*Time.deltaTime, 0));
	shakeCamera();
}

function shakeCamera() {
	shakeIntensity *= Mathf.Exp(-damping*Time.deltaTime*0.5);
	transform.position += Random.insideUnitCircle*shakeIntensity;
}