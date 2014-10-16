/*
 * Zombie Spawn-Engine
 * Supposed to be able to handle multiple commands to predefine a sequence of
 * zombie spawning for a game level
 */

#pragma strict
import System.Collections.Generic;


enum Edge { TOP, BOTTOM, LEFT, RIGHT }

var checkingDelay : float = 0.5; // number of seconds between checking for new 
							   	 // due spawns. Higher numbers should improve
							   	 // performance but decrease "spawn time-resolution"
private var lastCheckTime : float;

var spawnJobs : List.<ZombieSpawnJob>;

var waves : List.<ZombieWave>;

var isEndless : boolean = false;
var waveNum : int = 1;

var easyMode : float = 0.5;
var normalMode : float = 1;
var hardMode : float = 2;
var insaneMode : float = 3.5;

var limitZombieCount: boolean;
var maxZombiesLimit : int = 50;
var undeadCount : int;

var diffMultiplier : float;

var victory : boolean = false;

function Awake() {
	spawnJobs = new List.<ZombieSpawnJob>();
	waves = new List.<ZombieWave>();
	// Default is Normal Mode for Missions.
	if(!isEndless) {
		diffMultiplier = normalMode;
	}
	// Survival starts with easy mode, but can be modified in future. TODO
	else
		diffMultiplier = easyMode;
}

function Update() {
	// only check for spawning every so often to avoid performance drop
	if ((Time.time - lastCheckTime) > checkingDelay) {
		lastCheckTime = Time.time;
		// Count the zombies in the field.
		undeadCount = GameObject.FindGameObjectsWithTag("zombie").Length;
		// TODO: I think this is breaking Unity.
//		if(spawnJobs.Count > 0)
			handleSpawnJobs();
	}
	
	if (spawnJobs.Count==1&&undeadCount==0) {
		//Debug.Log("checking victory " + victory + " " + spawnJobs.Count + " " + undeadCount);
		victory = true;
	}
}

function checkSpawnJobs() : int {
	return spawnJobs.Count;
}

function checkUndeadCount() : int {
	return undeadCount;
}

function isVictory() : boolean {
	return victory;
}

function spawnSingleNow(prefab : GameObject, position : Vector2, spread : Vector2) {
	var spawn : ZombieSpawnJob = new ZombieSpawnJob(prefab, Time.time, 1, 1, position, spread);
	spawnJobs.Add(spawn);
}

function addWave(newWave : ZombieWave) {
	if(!ReferenceEquals(newWave, null))
	{
		waves.Add(newWave);
	}
	else
		Debug.Log("Wave is null.");
}

function startNextWave() {
// Pull out all the spawn jobs from the next wave.
	if(!isEndless) {
		spawnJobs = waves[waveNum].getWaveSpawns();
		waveNum++;
	}
	else {
		spawnJobs = waves[waveNum%waves.Count].getWaveSpawns();
		waveNum++;
	// We could step up difficulty by sets of waves. That kind of makes more sense.
	// If we do that, we could put all that work in here.
		switch (waveNum / waves.Count) {
			case 0: diffMultiplier = easyMode;
					break;
			case 1: diffMultiplier = normalMode;
					break;
			case 2: diffMultiplier = hardMode;
					break;
			case 3: diffMultiplier = insaneMode;
					break;
			default: diffMultiplier = waveNum / waves.Count - 2;
						break;
		}
	}
}

function noMoreSpawns() {
	return spawnJobs.Count == 0;
}

function noMoreWaves() {
	return waves.Count == 0;
}

function handleSpawnJobs() {
	var i : int = 0;
	while (i < spawnJobs.Count) {
		if (spawnJobs[i].isExpired()) {
			spawnJobs.RemoveAt(i);
		} else {
			if(!limitZombieCount || undeadCount < maxZombiesLimit) {
				spawnJobs[i].setHealthMultiplier(diffMultiplier);
				if(spawnJobs[i].spawnIfDue())
					undeadCount++;
			}
			i++;
		}
	}
}