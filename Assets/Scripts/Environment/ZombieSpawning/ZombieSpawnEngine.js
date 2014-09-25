/*
 * Zombie Spawn-Engine
 * Supposed to be able to handle multiple commands to predefine a sequence of
 * zombie spawning for a game level
 */

#pragma strict
import System.Collections.Generic;


enum Edge { TOP, BOTTOM, LEFT, RIGHT }

var checkingDelay : float = 0.1; // number of seconds between checking for new 
							   	 // due spawns. Higher numbers should improve
							   	 // performance but decrease "spawn time-resolution"
private var lastCheckTime : float;

private var spawnJobs : List.<ZombieSpawnJob>;

private var HEALTH_INCREASE_TIMESTEP : float = 200;

function Awake() {
	spawnJobs = new List.<ZombieSpawnJob>();
}

function Update() {
	// only check for spawning every so often to avoid performance drop
	if ((Time.time - lastCheckTime) > checkingDelay) {
		lastCheckTime = Time.time;		
		handleSpawnJobs();	
	}
}

function handleSpawnJobs() {
	var i : int = 0;
	while (i < spawnJobs.Count) {
		if (spawnJobs[i].isExpired()) {
			spawnJobs.RemoveAt(i);
		} else {
			spawnJobs[i].setHealthMultiplier(1 + (Time.timeSinceLevelLoad / HEALTH_INCREASE_TIMESTEP));
			spawnJobs[i].spawnIfDue();
			i++;
		}
	}
}

/*
 * Creates an instance of the specified prefab at a 
 * certain position on or outside the map
 * time		Specifies the number of seconds after the start of the survival mode
 * 			when the spawning should take place after the start of the level
 */
function spawnSingle(prefab : GameObject, time : float, position : Vector2) {
	spawnSingle(prefab, time, position, Vector2.zero);
}


/* 
 * Creates an instance of the specified prefab at a 
 * certain position on or outside the map
 * spread is the maximum random deviation from position in
 * x and y direction
 * (uniformly distributed)
 * time		Specifies the number of seconds after the start of the survival mode
 * 			when the spawning should take place after the start of the level
 */
function spawnSingle(prefab : GameObject, time : float, position : Vector2, spread : Vector2) {
	spawnJobs.Add(new ZombieSpawnJob(prefab, time, 1, 1, position, spread));
}

/* 
 * Creates an instance of the specified prefab at a 
 * random position on a specified edge
 * (uniformly distributed)
 * time		Specifies the number of seconds after the start of the survival mode
 * 			when the spawning should take place after the start of the level
 */
function spawnSingle(prefab : GameObject, time : float, edge : Edge) {
	spawnJobs.Add(new ZombieSpawnJob(prefab, time, 1, 1, edge));
}

/* 
 * Creates an instance of the specified prefab at a 
 * random position on a specified edge
 * (uniformly distributed)
 * time		Specifies the number of seconds after the start of the survival mode
 * 			when the spawning should take place after the start of the level
 */
function spawnSingle(prefab : GameObject, time : float, edges : Edge[]) {
	spawnJobs.Add(new ZombieSpawnJob(prefab, time, 1, 1, edges));
}


/*
 * 
 * endTime 	Time in seconds for how long spawning should take place (set to Mathf.infinity
 * 			for spawning until game ends.
 */
function spawnContinuous(prefab : GameObject, startTime : float, duration : float, 
		zombieNumber : int, position : Vector2) {
	spawnContinuous(prefab, startTime, duration, zombieNumber, position, new Vector2(0, 0));
}


/*
 * 
 * endTime 	Time in seconds for how long spawning should take place (set to Mathf.infinity
 * 			for spawning until game ends.
 */
function spawnContinuous(prefab : GameObject, startTime : float, duration : float, 
		zombieNumber : int, position : Vector2, spread : Vector2) {
	spawnJobs.Add(new ZombieSpawnJob(prefab, startTime, duration, zombieNumber, position, spread));
}

/*
 * 
 * endTime 	Time in seconds for how long spawning should take place (set to Mathf.infinity
 * 			for spawning until game ends.
 */
function spawnContinuous(prefab : GameObject, startTime : float, duration : float, 
		zombieNumber : int, edge : Edge) {	
	spawnJobs.Add(new ZombieSpawnJob(prefab, startTime, duration, zombieNumber, edge));
}

function spawnConstantly(prefab : GameObject, startTime : float, duration : float, delay : float,
		edge : Edge) {
	spawnJobs.Add(new ZombieSpawnJob(prefab, startTime, duration, delay, edge));
		}
