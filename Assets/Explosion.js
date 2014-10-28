#pragma strict

var explosionSound : AudioClip;

var damage : float = -1;
var damageDone : boolean;

var owner : GameObject;

function Start () {
	owner = GameObject.Find("zed");
	AudioSource.PlayClipAtPoint(explosionSound,transform.position);
	TimedObjectDestructor.destroyGameObjectInSeconds(gameObject, 1);
}

function Update() {
	if (!damageDone && damage > 0) {
		processExplosion();
		damageDone = true;
	}
}

function setDamage(dmg : float) {
	this.damage = dmg;
}

function processExplosion() {
	var colliders : Collider2D[] = Physics2D.OverlapCircleAll(transform.position, transform.lossyScale.x/2);
	for (var c : Collider2D in colliders) {
	if (c.gameObject.CompareTag("zombie")) {
		c.gameObject.GetComponent(ZombieImpact).damage(damage);
		}
	}
}