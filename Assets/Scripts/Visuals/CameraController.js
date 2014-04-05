﻿#pragma strict

var target : Transform;

private var leftBound : float;
private var rightBound : float;
private var topBound : float;
private var bottomBound : float;

private var cameraSpeedX : float;
private var cameraSpeedY : float;
var cameraAcceleration : float;
var cameraDampingFactor : float;
var mouseInfluenceWeight : float;

function Start(){
	leftBound = EnvironmentAttributes.mapBounds.min.x + (Camera.main.orthographicSize * Camera.main.aspect);	
	rightBound =  EnvironmentAttributes.mapBounds.max.x - (Camera.main.orthographicSize * Camera.main.aspect);	
	bottomBound = EnvironmentAttributes.mapBounds.min.y + Camera.main.orthographicSize;	
	topBound = EnvironmentAttributes.mapBounds.max.y - Camera.main.orthographicSize;
}

function Update () {

	
	var zedPosition : Vector3 = target.position;
	var camPosition : Vector3 = transform.position;
	
	
	var mouseScreenPosition : Vector3 = Input.mousePosition;
	mouseScreenPosition.z = -transform.position.z;
	var mouseWorldPosition : Vector3 = Camera.main.ScreenToWorldPoint(mouseScreenPosition);	
	
	
	var targetPosition : Vector3 = (1 - mouseInfluenceWeight)*zedPosition + mouseInfluenceWeight*mouseWorldPosition;
	
	if (targetPosition.x < leftBound) targetPosition.x = leftBound;
	if (targetPosition.x > rightBound) targetPosition.x = rightBound;
	if (targetPosition.y > topBound) targetPosition.y = topBound;
	if (targetPosition.y < bottomBound) targetPosition.y = bottomBound;
	
	

	
	var delta : Vector3 = (targetPosition - camPosition);
	cameraSpeedX += cameraAcceleration * delta.x;
	cameraSpeedY += cameraAcceleration * delta.y;
	
	cameraSpeedX *= cameraDampingFactor;
	cameraSpeedY *= cameraDampingFactor;

	transform.position += (new Vector3(cameraSpeedX*Time.deltaTime, cameraSpeedY*Time.deltaTime, 0));
				

}