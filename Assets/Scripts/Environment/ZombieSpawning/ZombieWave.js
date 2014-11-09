#pragma strict

import System.Collections.Generic;

class ZombieWave extends UnityEngine.Object{

// Just contains all the spawns.
var spawns : List.<ZombieSpawnJob>;

// For normal missions, just set the boolean to false.

function ZombieWave(spawns : List.<ZombieSpawnJob>) {
	this.spawns = spawns;
}

function ZombieWave() {
	spawns = new List.<ZombieSpawnJob>();
}

function isEmpty() : boolean {
	return spawns.Count <= 0;
}

function addJob(newJob : ZombieSpawnJob) {
	if(newJob != null)
		spawns.Add(newJob);
	else
		Debug.Log("Spawn is null");
}

function getWaveSpawns() : List.<ZombieSpawnJob> {
	if(spawns == null)
		return new List.<ZombieSpawnJob>();
	else {
		//Debug.Log("Spawn count: " + spawns.Count);
		var newJobList : List.<ZombieSpawnJob> = new List.<ZombieSpawnJob>();
		for(var i : int = 0; i < spawns.Count; i++) {
			newJobList.Add(spawns[i]);
			newJobList[i].waveStart();
		}
	}
	return newJobList;
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
	var spawn : ZombieSpawnJob = ZombieSpawnJob(prefab, time, 1, 1, position, spread);
	spawns.Add(spawn);
}

/* 
 * Creates an instance of the specified prefab at a 
 * random position on a specified edge
 * (uniformly distributed)
 * time		Specifies the number of seconds after the start of the survival mode
 * 			when the spawning should take place after the start of the level
 */
function spawnSingle(prefab : GameObject, time : float, edge : Edge) {
	var spawn : ZombieSpawnJob;
	spawn = new ZombieSpawnJob(prefab, time, 1, 1, edge);
	spawns.Add(spawn);
}

/* 
 * Creates an instance of the specified prefab at a 
 * random position on a specified edge
 * (uniformly distributed)
 * time		Specifies the number of seconds after the start of the survival mode
 * 			when the spawning should take place after the start of the level
 */
function spawnSingle(prefab : GameObject, time : float, edges : Edge[]) {
	var spawn : ZombieSpawnJob = ZombieSpawnJob(prefab, time, 1, 1, edges);
	spawns.Add(spawn);
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
	var spawn : ZombieSpawnJob = ZombieSpawnJob(prefab, startTime, duration, zombieNumber, position, spread);
	spawns.Add(spawn);
}

/*
 * 
 * endTime 	Time in seconds for how long spawning should take place (set to Mathf.infinity
 * 			for spawning until game ends.
 */
function spawnContinuous(prefab : GameObject, startTime : float, duration : float, 
		zombieNumber : int, edge : Edge) {	
	var spawn : ZombieSpawnJob = ZombieSpawnJob(prefab, startTime, duration, zombieNumber, edge);
	spawns.Add(spawn);
}

}