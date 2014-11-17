#pragma strict

var destructionTime : float;

function Start () {
	TimedObjectDestructor.destroyGameObjectInSeconds(gameObject, destructionTime);
}
