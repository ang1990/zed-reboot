#pragma strict

class BossZombieBehaviour extends ZombieBehaviour {

/* Following Finite State Machine style, Boss Zombie has 3 behaviours:
*  Attacking, Summon, AfterSummon.
*
*  Attacking State:
*  Boss Zombie will path towards Zed, like a Chaser Zombie.
*  After phaseChangedTime seconds, it will enter Summon mode.
*
*  Summon State:
*  Boss Zombie will stand still and spawn quantitySpawned number of packZombies.
*  It does this by initiating a spawn job around itself. Once done, it enters
*  AfterSummon state.
*
*  AfterSummon State:
*  AfterSummon is like a cooldown period, where Boss Zombie does not move. This
*  state lasts for phaseChangedTime seconds.
*
*/

enum BossZombieState {Attacking, Summon};

// Standard/Spawning variables
var speed : float;
var angularSpeed : float;
var strikeRange : float;
private var direction : float;

// Target-related data
private var target : GameObject;

// Position-related data
var nextPosition : Vector3;

// Current State
var currentState : BossZombieState;

// Zombie data
private var zombieResources : ZombieResources;
private var zombieStrike : ZombieStrike;
private var navigator : PolyNavAgent;

// Zombie-minion spawning data
private var zombieSpawnEngine : ZombieSpawnEngine;
var zombiePrefab : GameObject;
var quantityToSpawn : int = 4;
var zombieSpawningDuration : float = 3.0;
var timeSpentAttacking : float = 10.0;
var phaseChangedTime : float;
var numSpawned : int;

function Start () {
	zombieSpawnEngine = GameObject.Find("environment").GetComponent(ZombieSpawnEngine) as ZombieSpawnEngine;
	setTarget(GameObject.Find("zed"));
	navigator = gameObject.GetComponent(PolyNavAgent);
	zombieStrike = gameObject.GetComponent(ZombieStrike) as ZombieStrike;
	zombieResources = gameObject.GetComponent(ZombieResources) as ZombieResources;
	phaseChangedTime = Time.time;
	currentState = BossZombieState.Attacking;
}

function Update () {

	if (currentState == BossZombieState.Attacking) {
		// Set nextPosition to the target's position.
		// If within range, attack target.
		navigator.SetDestination(Vector2(target.transform.position.x, target.transform.position.y));
		
		if(Vector3.Magnitude(transform.position - target.transform.position) < strikeRange) {
			zombieStrike.hitTarget(target);
		}
		if(Time.time > phaseChangedTime + timeSpentAttacking) {
			currentState = BossZombieState.Summon;
			phaseChangedTime = Time.time;
			navigator.SetDestination(Vector2(transform.position.x, transform.position.y));
		}
 	} else if (currentState == BossZombieState.Summon) {
		if(Time.time > phaseChangedTime + (zombieSpawningDuration / quantityToSpawn * numSpawned)) {
			if(numSpawned >= quantityToSpawn) {
				currentState = BossZombieState.Attacking;
				phaseChangedTime = Time.time;
				numSpawned = 0;
			}
			else {
//				zombieSpawnEngine.spawnSingle(zombiePrefab,Time.time,transform.position,Vector2(1,1));
				numSpawned++;
			}
		}
	}
}

function setTarget(target : GameObject) {
	this.target = target;
}

}