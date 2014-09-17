#pragma strict

/*
*  Zombie strike class to manage zombie melee attack.
*/

private var zombieResources : ZombieResources;
private var zombieProperties : ZombieProperties;

private var explosionCollider : CircleCollider2D;

var explosionRadius : float;
var explosionDamage : float;

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
	var colliders : Collider2D[] = Physics2D.OverlapCircleAll(explosionCollider.center,explosionCollider.radius);
	explosionCollider.radius = explosionRadius;
	for (var c : Collider2D in colliders) {
		if(c.gameObject.CompareTag("zed")) {
			c.gameObject.GetComponent(ZedResources).reduceHealth(explosionDamage);
		}
		// TODO: Input terrain damage handling here.
		//
		//
	}
	// Zombie cuts his own health to zero.
	zombieResources.reduceHealth(zombieProperties.getMaxHealth());
	
	// TODO: Input animation and destruction of zombie here.



}