/*
 * Behaviour of an ammo drop.
 */ 


#pragma strict

var numberOfClips : int = 1;
var maxStartSpeed : float;
var decelerationCoefficient : float;
var _transform : Transform;

var pickupSound : AudioClip;

private var velocity : Vector2;
private var angularSpeed : Vector3;
private var stopped : boolean;

function Start() {
	velocity = new Vector2(Random.Range(-maxStartSpeed, maxStartSpeed), 
			Random.Range(-maxStartSpeed, maxStartSpeed));
	_transform = transform;
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
		Debug.Log("Error! Ammo pickup collected by GameObject without ZedResources");
	}
	AudioSource.PlayClipAtPoint(pickupSound,_transform.position);
	for(var weapon : Weapon in zedResources.weapons) {
		if (weapon.id != "turretplacer") {
			weapon.addClips(numberOfClips); 
		}
	}
	waitForEndOfFrame();
	Destroy(gameObject);
}

function waitForEndOfFrame() {
	yield WaitForEndOfFrame();
}
