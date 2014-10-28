#pragma strict

var prefab : GameObject;
var explosionCollider : CircleCollider2D;

var damage : float = 300;

var radiusExpanded : boolean;

var mineTriggerSound : AudioClip;

function Start() {
	radiusExpanded = false;
	explosionCollider = GetComponent(CircleCollider2D);
}

function OnTriggerEnter2D(coll : Collider2D) {
	if (coll.gameObject.tag == "zombie") {
		AudioSource.PlayClipAtPoint(mineTriggerSound, transform.position);
		generateExplosion();
		Destroy(gameObject);
	}
}

function generateExplosion() {
	var explosion = Instantiate(prefab, transform.position, Quaternion.identity);
	explosion.GetComponent(Explosion).setDamage(damage);
}