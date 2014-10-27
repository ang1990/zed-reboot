#pragma strict

/*
 * Manages timed destruction of GameObjects
 * If a GameObject should be destroyed after a 
 * certain amount of time, the function 
 * destroyGameObjectInSeconds can be called.
 */

import System.Collections.Generic;

class DoomedObject {
	var gameObject : GameObject;
	var destroyTime : float;
	function DoomedObject(gameObject : GameObject, 
			destroyTime : float) {
		this.gameObject = gameObject;
		this.destroyTime = destroyTime;		
	}
}

private static var objectsToBeDestroyed : List.<DoomedObject>;

function Awake() {
	objectsToBeDestroyed = new List.<DoomedObject>();
}

function Update () {
	destroyListedObjects();	
}

/*
 * gameObject will be automatically removed in the 
 * specified time
 */
static function destroyGameObjectInSeconds(gameObject : GameObject,
		seconds : float) {
	objectsToBeDestroyed.Add(
			new DoomedObject(gameObject, Time.timeSinceLevelLoad + seconds) );
}

/*
 * Called every frame, destroys all due objects from the list
 */ 
private function destroyListedObjects() {
	var i : int = 0;	
	while(i < objectsToBeDestroyed.Count) {	
		if (objectsToBeDestroyed[i].destroyTime < Time.timeSinceLevelLoad) {				
			GameObject.Destroy(objectsToBeDestroyed[i].gameObject);
			objectsToBeDestroyed.RemoveAt(i);
		} else {
			i++;
		}
	}
}