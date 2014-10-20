#pragma strict

/*
*  Zombie strike class to manage zombie melee attack.
*/

private var zombieResources : ZombieResources;
private var zombieProperties : ZombieProperties;

private var explosionCollider : CircleCollider2D;

var explosionPrefab : GameObject;

var explosionRadius : float;
var explosionPower : float;

var animator : Animator;

function Awake() {
	explosionCollider = GetComponent(CircleCollider2D);
	zombieProperties = GetComponent(ZombieProperties);
	zombieResources = GetComponent(ZombieResources);
	animator = GetComponent(Animator);
}

/*	
*	When the zombie self-destructs:
*		For all objects in area of explosion:
*			Calculate damage dealt to object, apply it.
*		Kill zombie. Render zombie until a few frames after explosion begins, and then stop rendering him.
		Remove zombie completely after explosion.
*/

function selfDestruct() {
	explosionCollider.radius = explosionRadius;
	var colliders : Collider2D[] = Physics2D.OverlapCircleAll(explosionCollider.center,explosionCollider.radius);
	for (var c : Collider2D in colliders) {
		if(c.gameObject.CompareTag("zed")) {
			var damageDealt : float = explosionPower * (1 - (c.transform.position - transform.position).sqrMagnitude / explosionRadius*explosionRadius);
			Debug.Log(damageDealt);
			c.gameObject.GetComponent(ZedResources).reduceHealth(damageDealt);
		}
		// TODO: Input terrain damage handling here.
		//
		//
	}
	
	Instantiate(explosionPrefab, transform.position, Quaternion.identity);
	// Zombie cuts his own health to zero, but after the self-destruct damage has been dealt, hence the waiting until the end of frame.
	yield WaitForEndOfFrame();
	zombieResources.reduceHealth(zombieProperties.getMaxHealth());
	
	// TODO: Input animation and destruction of zombie here.



}