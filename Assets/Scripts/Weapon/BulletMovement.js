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

var collideTags : String[] = ["tallTerrain", "zombie"];

var clips : AudioClip[];

function Start () {
	moving = true;
	clips = new AudioClip[3];
	clips[0] = Resources.Load("Sounds/ricochet_1") as AudioClip;
	clips[1] = Resources.Load("Sounds/ricochet_2") as AudioClip;
	clips[2] = Resources.Load("Sounds/ricochet_3") as AudioClip;
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

	if (raycastHit2D.Length > 0) {							
		// again raycast (this time infinitely long), to get all objects
		// in line of fire
		/*raycastHit2D = Physics2D.RaycastAll(
			rayCastStart,  
			rayCastDirection, 
			Mathf.Infinity);
		
		if (raycastHit2D.Length == 0) {
			Debug.Log("error in BulletMovement.js: second raycast empty!");
			return;
		}*/
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
	
		
		var indexHit : int = 0;
		for (hit in raycastHit2D) {
			if(stopsBullet(hit.collider.gameObject)) {
				break;
			}
			else indexHit++;
		}
		if(indexHit < raycastHit2D.Length) {
			var firstHitObject : GameObject = raycastHit2D[indexHit].collider.gameObject;
			Debug.Log(firstHitObject.tag);
			
			var stopLocation : Vector3 = _transform.position +
							raycastHit2D[0].fraction*lastDeltaTime*speed*transform.right;
			
			if (firstHitObject.CompareTag("zombie")) {
				evaluateZombieCollision(raycastHit2D, firstHitObject);
				// bullet to be destroyed
				destroyBulletAtLocation(stopLocation);
			}
			else if (firstHitObject.CompareTag("tallTerrain")) {
				AudioSource.PlayClipAtPoint(clips[Random.Range(0,clips.Length-0.001)], transform.position);
				destroyBulletAtLocation(stopLocation);
			}
		}
	}	
}


function destroyBulletAtLocation(position : Vector3) {
	finalPosition = position;				
	moving = false;
	TimedObjectDestructor.destroyGameObjectInSeconds(gameObject, trailRenderer.time);
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

private function stopsBullet(o : GameObject) : boolean {
	for (tag in collideTags) {
		if (o.CompareTag(tag)) {
			return true;
		}
	}
	return false;
}
