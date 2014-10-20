#pragma strict

 var explosionSound : AudioClip;

function Start () {
	AudioSource.PlayClipAtPoint(explosionSound,transform.position);
	TimedObjectDestructor.destroyGameObjectInSeconds(gameObject, 1);
}