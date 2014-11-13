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

function selfDestruct() {
	generateExplosion();
	zombieResources.reduceHealth(zombieProperties.getMaxHealth());
}

function generateExplosion() {
	var explosion = Instantiate(explosionPrefab, transform.position, Quaternion.identity);
	explosion.GetComponent(Explosion).setDamage(damage);
	explosion.GetComponent(Explosion).setAllegiance(gameObject.tag);
	Debug.Log("Explosion!");
}


