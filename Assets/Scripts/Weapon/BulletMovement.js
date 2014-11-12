/*
 * Moves the bullet according to its speed and takes care of collisions.
 */

#pragma strict

import System.Collections.Generic;

var _transform : Transform;
var trailRenderer : TrailRenderer;
var spriteRenderer : SpriteRenderer;
var bulletProperties : BulletProperties;
private var speed : float;
private var lastDeltaTime : float;
private var finalPosition : Vector3;
private var moving : boolean;

function Start () {
	moving = true;
}

function Update () {
	// bullet always moves distance predicted in last frame
	if (moving) {
		move();		
		checkCollision();
		checkBoundaries();
	} else {
		_transform.position = finalPosition;
		spriteRenderer.enabled = false;			
	}
}

function setSpeed(speed : float) {
	this.speed = speed;
}

private function move() {
	_transform.position += lastDeltaTime*speed*_transform.right;
	lastDeltaTime = Time.deltaTime;
}


/*
 * Casts a ray to predict if bullet will collide with any Collider
 * between now and the next frame. If there is a collider, 
 * it gets all colliders that are in line of movement 
 */
private function checkCollision() {
	var rayCastStart : Vector2 = new Vector2(_transform.position.x, _transform.position.y);
	var rayCastDirection : Vector2 = new Vector2(_transform.right.x, _transform.right.y);
	var rayCastLength : float = Time.deltaTime*speed;

	var raycastHit2D : RaycastHit2D[] = Physics2D.RaycastAll(
			rayCastStart,  
			rayCastDirection, 
			rayCastLength);

// Ignore raycast code. Defunct since the object can be set to ignore raycasts.
/*
	var detectorsOnly : boolean = true;
		
	for(var hit in raycastHit2D) {
		if(!hit.collider.gameObject.CompareTag("detector")) {
			detectorsOnly = false;
			break;
		}
	}
	if(detectorsOnly)
		return;
*/					
	if (raycastHit2D.Length != 0) {							
		// again raycast (this time infinitely long), to get all objects
		// in line of fire
		raycastHit2D = Physics2D.RaycastAll(
			rayCastStart,  
			rayCastDirection, 
			Mathf.Infinity);
		
		if (raycastHit2D.Length == 0) {
			Debug.Log("error in BulletMovement.js: second raycast empty!");
			return;
		}
	/*	
		var hitList : List.<RaycastHit2D> = new List.<RaycastHit2D>();
		var i : int = 0;
		while (i < raycastHit2D.Length) {		
			if (!raycastHit2D[i].collider.gameObject.CompareTag("detector")) {
				hitList.Add(raycastHit2D[i]);
			}		
			i++;
		}
		
		if (hitList.Count == 0) return;
	*/
		var firstHitObject : GameObject = raycastHit2D[0].collider.gameObject;
		
		if (firstHitObject.CompareTag("zombie")) {
			evaluateZombieCollision(raycastHit2D, firstHitObject);
			
			// bullet to be destroyed
			finalPosition = _transform.position + raycastHit2D[0].fraction*lastDeltaTime*speed*transform.right;				
			moving = false;
			TimedObjectDestructor.destroyGameObjectInSeconds(gameObject,
				trailRenderer.time);
		}
		else if (firstHitObject.CompareTag("tallTerrain")) {
			finalPosition = _transform.position + raycastHit2D[0].fraction*lastDeltaTime*speed*transform.right;				
			moving = false;
			TimedObjectDestructor.destroyGameObjectInSeconds(gameObject,
				trailRenderer.time);
		}
		
	}	
}




function evaluateZombieCollision(hitList : RaycastHit2D[], firstHitObject : GameObject) {	
	var hitChildren : List.<GameObject> = new List.<GameObject>();

	for (var hitObject : RaycastHit2D in hitList) {
		if (hitObject == firstHitObject) {
			hitChildren.Add(hitObject.collider.gameObject);
		}
	}
	
	var zombieImpact : ZombieImpact = firstHitObject.transform.root.gameObject.GetComponent(ZombieImpact);
	if (zombieImpact != null) {
		zombieImpact.impact(
			bulletProperties.getOwner(), 
			bulletProperties.getPower(), 
			new Vector2(speed*_transform.up.x, speed*_transform.up.y), 
			hitChildren);
	}
}


private function checkBoundaries() {
	var pos : Vector3 = _transform.position;
	
	if ((pos.x < EnvironmentAttributes.mapBounds.min.x) 
			|| (pos.x > EnvironmentAttributes.mapBounds.max.x) 
 			|| (pos.y < EnvironmentAttributes.mapBounds.min.y) 
 			|| (pos.y > EnvironmentAttributes.mapBounds.max.y)) {
		
		TimedObjectDestructor.destroyGameObjectInSeconds(gameObject,
				trailRenderer.time);
				
		finalPosition = _transform.position;		
		moving = false;
	}
}