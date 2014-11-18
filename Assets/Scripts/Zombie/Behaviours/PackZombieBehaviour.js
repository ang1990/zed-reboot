#pragma strict

class PackZombieBehaviour extends ZombieBehaviour {

/* Following Finite State Machine style, Pack Zombie has 3 states:
*  Wandering, Following, Attacking.
*  
*  Wandering State:
*  The Pack Zombie will path towards a randomly plotted point on the map.
*  When the point is reached, it re-plots another point randomly and paths to it.
*
*  State Change conditions:
*  Target comes within targetVisualRange: Enter Attack Mode
*  Leader Zombie comes within leaderDetectionRange: Enter Following Mode.
*
*  Following State:
*  The Pack Zombie will assign the leader it discovered as its current leader.
*  It will path towards a random point relative to the leader to “assume position”
*  alongside it.
*  If the leader enters Attacking Mode, the Pack Zombie will switch its own mode to
*  Attacking, and “receive” a speed boost.
*
*  State Change conditions:
*  Leader dies: Enter Wandering Mode.
*  Leader enters Attacking Mode: Enter Attacking Mode.
*
*  Attacking State:
*  The Pack Zombie will path towards the target, and once within range, will attempt
*  to attack it. It will not leave this mode until either the target dies or it dies.
*  
*  State Change conditions:
*  Target dies: Enter Wandering Mode.
*/

enum PackZombieState {Wandering,Following,Attacking};

// Standard / spawning variables
var speed : float;
private var speedDeviation : float;
var angularSpeed : float;
private var centralizationOfDeviation : int;
var strikeRange : float;
private var direction : float;
private var chanceToSpawnAsInterceptor : float = 0.25;
private var isInterceptor : boolean;

// Target-related data
@HideInInspector var target : GameObject;
var targetVisualRange : float;

// current state
var currentState : PackZombieState;

// Leader-related data
var leader : GameObject;
var leaderDetectionRange : float;
private var positionRelativeToLeader : Vector2;
var maxDistanceFromLeader : float = 3.0;
var leaderSpeedupFactor : float = 2.0;

// Position-related data
var nextPosition : Vector3;
var positionDifference : Vector3;
var reachedNextPosition : float;

// Zombie data
private var zombieResources : ZombieResources;
private var zombieStrike : ZombieStrike;
private var zombieMovement2 : ZombieMovement2;
// Mapbounds
private var mapBounds : Bounds;

function Start() {
	plotRandomPosition();
	zombieStrike = gameObject.GetComponent(ZombieStrike) as ZombieStrike;
	zombieMovement2 = gameObject.GetComponent(ZombieMovement2) as ZombieMovement2;
	zombieResources = gameObject.GetComponent(ZombieResources) as ZombieResources;
	getTargetAngle(nextPosition);
	mapBounds = GameObject.Find("environment").GetComponent(SpriteRenderer).bounds;
	if(centralizationOfDeviation > 0) {
		var speedDeviationFraction : float = speedDeviation / centralizationOfDeviation;
		for (var i = 0; i < centralizationOfDeviation; i++) {
			speed += Random.Range(-speedDeviationFraction, speedDeviationFraction);
		}
	}
	zombieMovement2.updateTargetSpeed(speed);
	currentState = PackZombieState.Wandering;
	positionRelativeToLeader = Random.insideUnitCircle * maxDistanceFromLeader;
	isInterceptor = Random.value < chanceToSpawnAsInterceptor;
}

function Update() {
	positionDifference = nextPosition - transform.position;
	// Additional behaviour dependent on currentState.
	switch (currentState) {
	case PackZombieState.Wandering : 
		zombieMovement2.updateTargetAngle(getTargetAngle(nextPosition));
	// If Pack Zombie has reached the next position, plot another random position.
		if(Vector3.Magnitude(positionDifference) < reachedNextPosition) {
			plotRandomPosition();
		}
	// Leader is set by LeaderDetector script.
		if(leader != null && leader.GetComponent(ZombieResources).isAlive()) {
			currentState = PackZombieState.Following;
			speed = leader.GetComponent(LeaderZombieBehaviour).speed * 1.2;
		}
	// TODO: Target will soon be set by TargetSelector. For now, LeaderDetector takes up that role,
	// 		using the same collider that is used to detect leaders.
		if(target != null) {
			currentState = PackZombieState.Attacking;
		}
		break;
		// If following, adopt a position around the leader, and stay close to the leader.
	case PackZombieState.Following :
		nextPosition = leader.transform.position + positionRelativeToLeader;
		zombieMovement2.updateTargetAngle(getTargetAngle(nextPosition));
		// If Pack Zombie has reached his assumed position, he will alternate between slowing down and speeding up to maintain his position.
		if(Vector3.Magnitude(nextPosition - transform.position) < reachedNextPosition) {
			zombieMovement2.updateTargetSpeed(speed * 0.9);
		}
		else zombieMovement2.updateTargetSpeed(speed * 1.05);
		// If the leader is attacking a target, they will enter attack mode and also attack the target.
		// Pack Zombies entering attack mode by this means will receive a speed boost, presumably from
		// leader motivation.
		if(leader.GetComponent(LeaderZombieBehaviour).isAttacking()) {
			currentState = PackZombieState.Attacking;
			speed *= leaderSpeedupFactor;
			target = leader.GetComponent(LeaderZombieBehaviour).getTarget();
		}
		// If the leader dies, the pack zombie begins to wander again, having lost their leader.
		// The leader is set to null, and currentState returns to Wandering.
		else if(!leader.GetComponent(ZombieResources).isAlive()) {
			currentState = PackZombieState.Wandering;
			leader = null;
		}
		break;
		// Attacking state is maintained until the target dies, until the Pack Zombie dies.
		// He will kill the target or die trying.
	case PackZombieState.Attacking : 
		// Set nextPosition to the target's position.
		nextPosition = target.transform.position;
		zombieMovement2.updateTargetAngle(getTargetAngle(nextPosition));
		zombieMovement2.updateTargetSpeed(speed);
		// If within range, attack target.
		if(Vector3.Magnitude(nextPosition - transform.position) < strikeRange) {
			zombieStrike.hitTarget(target);
		}
		// If the target isn't Zed, then it's probably a turret.
/*		if(!target.CompareTag("Player")) {
			if(target.GetComponent(TurretResources.isDead())) {
				target = null;
				currentState = PackZombieState.Wandering;
			}
		}*/
		break;
	default: break;
	}
}

function getTargetAngle(destination : Vector3) : float {
	positionDifference = destination - transform.position;
	var targetDifference = positionDifference;
	if(isInterceptor) {
		if(target != null && target.GetComponent(ZedMovement) != null && Vector3.Magnitude(positionDifference) < 0.5*targetVisualRange) {
			targetDifference = positionDifference + (target.GetComponent(ZedMovement).getCurrentVelocity());
		}
	}
	return Mathf.Rad2Deg*Mathf.Atan2(targetDifference.y, targetDifference.x)-90;
}
/*
function moveTowards(destination : Vector3) {
	positionDifference = destination - transform.position;
	positionDifference.z = 0;
	var targetDirection : float = Mathf.Rad2Deg*Mathf.Atan2(positionDifference.y, positionDifference.x);
	
	var angleDifference : float = (targetDirection - direction);
	if (angleDifference > 180) {
		angleDifference -= 360;
	}
	if (angleDifference < -180) {
		angleDifference += 360;
	}
	
	direction += angularSpeed*speed*Time.deltaTime*angleDifference;
	
	transform.eulerAngles = new Vector3(0, 0, direction-90);

	rigidbody2D.velocity = new Vector2(
		speed*Mathf.Cos(Mathf.Deg2Rad*direction), 
		speed*Mathf.Sin(Mathf.Deg2Rad*direction));
}
*/

function getTargetVisualRange() {
	return targetVisualRange;
}

function setLeader(newLeader : GameObject) {
	leader = newLeader;
}

function getTarget() : GameObject {
	return target;
}

function setTarget(target : GameObject) {
	this.target = target;
}

function plotRandomPosition() {
	var nextX = Random.Range(mapBounds.min.x,mapBounds.max.x);
	var nextY = Random.Range(mapBounds.min.y,mapBounds.max.y);
	nextPosition = Vector3(nextX,nextY);
}
}