#pragma strict

/*
*  Zombie strike class to manage zombie melee attack.
*/

private var zombieResources : ZombieResources;
private var zombieProperties : ZombieProperties;

private var explosionCollider : CircleCollider2D;

var explosionPrefab : GameObject;

var explosionRadius : float;
var damage : float;

var animator : Animator;

function Awake() {
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
	generateExplosion();
	// Zombie cuts his own health to zero, but after the self-destruct damage has been dealt, hence the waiting until the end of frame.
	zombieResources.reduceHealth(zombieProperties.getMaxHealth());
	
	// TODO: Input animation and destruction of zombie here.
}

function generateExplosion() {
	var explosion = Instantiate(explosionPrefab, transform.position, Quaternion.identity);
	explosion.GetComponent(Explosion).setDamage(damage);
	explosion.GetComponent(Explosion).setAllegiance(gameObject.tag);
	Debug.Log("Explosion!");
}


