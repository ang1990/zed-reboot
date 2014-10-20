#pragma strict

var prefab : GameObject;
var explosionCollider : CircleCollider2D;

var healthToReduce : float = 300;

var radiusExpanded : boolean;

var mineTriggerSound : AudioClip;

function Start() {
	radiusExpanded = false;
	explosionCollider = GetComponent(CircleCollider2D);
}

function OnTriggerEnter2D(coll : Collider2D) {
	if (coll.gameObject.tag == "zombie") {
		var colliders : Collider2D[] = Physics2D.OverlapCircleAll(transform.position, explosionCollider.radius);
		for (var c : Collider2D in colliders) {	
			if (c.gameObject.tag == "zombie") {
				c.gameObject.GetComponent(ZombieResources).reduceHealth(healthToReduce);
			}
		}
	AudioSource.PlayClipAtPoint(mineTriggerSound, transform.position);
	Instantiate(prefab, transform.position, Quaternion.identity);
	Destroy(gameObject);
	}
}