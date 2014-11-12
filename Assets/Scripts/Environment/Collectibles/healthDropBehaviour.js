/*
 * Defines the behaviour of a coin as it is dropped. Has a trigger for picking a coin up.
 */


#pragma strict

var health : int;
var maxStartSpeed : float;
var maxEulerAngularSpeed : float;
var decelerationCoefficient : float;
var _transform : Transform;

var clinkSound : AudioClip;

private var velocity : Vector2;
private var angularSpeed : Vector3;
private var stopped : boolean; // whether coin has stopped sliding away from the body

function Start() {
	velocity = new Vector2(Random.Range(-maxStartSpeed, maxStartSpeed), 
			Random.Range(-maxStartSpeed, maxStartSpeed));
	angularSpeed = new Vector3(0, 0, Random.Range(-maxEulerAngularSpeed, maxEulerAngularSpeed));
	stopped = false;
}

 
function Update () {
	if (!stopped) {
		var velocityBefore : Vector2 = velocity;
		velocity -= velocity.normalized*Time.deltaTime*decelerationCoefficient;
		if (Vector2.Dot(velocityBefore, velocity) < 0) {
			velocity = Vector2.zero;
			stopped = true;
		}
		_transform.position += Time.deltaTime*velocity;
		_transform.Rotate(angularSpeed*Time.deltaTime);
	}
}


function OnTriggerEnter2D(other: Collider2D) {
	var otherGameObject = other.transform.root.gameObject;
	if (otherGameObject.CompareTag("zed")) {
		collect(otherGameObject.GetComponent(ZedResources));	
	}
}

function collect(zedResources : ZedResources) {
	if (zedResources == null) {
		Debug.Log("Error! Skill point collected by GameObject without ZedResources");
	}
	AudioSource.PlayClipAtPoint(clinkSound,_transform.position);
	Destroy(gameObject);
	zedResources.increaseHealth(health);
}