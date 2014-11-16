#pragma strict

/* Simple zombie behaviour.
*  Just path towards zed, and attack zed.
*  Future implementation should have Chaser Zombies selecting their targets
*  based on their proximity.
*
*	This implementation utilises PolyNav2D, bypassing ZombieMovement2.
*	Care will have to be taken to replace functions covered by ZombieMovement2.
*
*	Alternatively, substitute ZombieMovement2 with a script that handles the functions sans movement and angle,
*	and let PolyNav2D handle the navigation.
*/

class NormalZombieBehaviour extends ZombieBehaviour {

private var updateTime : float = 0.1;
private var lastUpdateTime : float;

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
var zombieProperties : ZombieProperties;
private var animator : Animator;
	
// Mapbounds
private var mapBounds : Bounds;

function Start() {
	setTarget(GameObject.Find("zed"));
	zombieStrike = transform.GetComponent(ZombieStrike) as ZombieStrike;
	zombieResources = transform.GetComponent(ZombieResources) as ZombieResources;
	navigator = transform.GetComponent(PolyNavAgent);
	animator = transform.GetComponent(Animator);
	lastUpdateTime = Time.timeSinceLevelLoad;
}

function Update() {
	if(Time.timeSinceLevelLoad > lastUpdateTime + updateTime) {
		lastUpdateTime = Time.timeSinceLevelLoad;
		navigator.SetDestination(Vector2(target.transform.position.x, target.transform.position.y));
		animator.SetFloat("speed", zombieProperties.getSpeed());
		// If zombie is within range, strike the target.
		if(Vector3.Magnitude(transform.position - target.transform.position) < strikeRange) {
				zombieStrike.hitTarget(target);
			}
	}
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
