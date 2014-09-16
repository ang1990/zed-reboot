#pragma strict

/* Simple zombie behaviour.
*  Just path towards zed, and attack zed.
*	TODO:
*	The explosion animation is not implemented, but the plan is to blow up the zombie,
*	causing a set amount of damage to the target. A future system would be to damage
*	terrain too, so damage calculation within the explosion radius can be done.
*
*  Future implementation should have Chaser Zombies selecting their targets
*  based on their proximity.
*
*/

class SuicideZombieBehaviour extends ZombieBehaviour {

// Standard/Spawning variables
private var speedDeviation : float;
private var centralizationOfDeviation : int;
var strikeRange : float;
private var chanceToSpawnAsInterceptor : float = 0.25;
private var isInterceptor : boolean;

// Target-related data: Currently can only target Zed.
var target : GameObject;
var targetVisualRange : float;

// Position-related data
var nextPosition : Vector2;

// Zombie scripts
var zombieResources : ZombieResources;
var zombieStrike : ZombieStrike;
var navigator : PolyNavAgent;
private var animator : Animator;
	
// Mapbounds
private var mapBounds : Bounds;

function Start() {
	setTarget(GameObject.Find("zed"));
	zombieStrike = transform.GetComponent(ZombieStrike) as ZombieStrike;
	zombieResources = transform.GetComponent(ZombieResources) as ZombieResources;
	navigator = transform.GetComponent(PolyNavAgent);
	animator = transform.GetComponent(Animator);
}

function Update() {
	navigator.SetDestination(Vector2(target.transform.position.x, target.transform.position.y));
	animator.SetFloat("speed", gameObject.GetComponent(Rigidbody2D).velocity.magnitude);
	// If zombie is within range, strike the target.
	if(Vector3.Magnitude(transform.position - target.transform.position) < strikeRange) {
			zombieStrike.hitTarget(target);
		}
		// If the target isn't Zed, then it's probably a turret.
/*		if(!target.CompareTag("Player")) {
			if(target.GetComponent(TurretResources.isDead())) {
				target = null;
				currentState = PackZombieState.Wandering;
			}
		}*/
}

function getTargetAngle(destination : Vector3) {
	return 0;
}

function getTargetVisualRange() {
	return targetVisualRange;
}

function getTarget() {
	return target;
}

function setTarget(target : GameObject) {
	this.target = target;
}
}

