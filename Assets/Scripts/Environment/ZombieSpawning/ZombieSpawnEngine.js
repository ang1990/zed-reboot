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

var limitMinesCount: boolean = true;
var maxMinesCount: int = 20;
var minesCount : int;

var diffMultiplier : float;

function Awake() {
	spawnJobs = new List.<ZombieSpawnJob>();
	waves = new List.<ZombieWave>();
	// Default is Normal Mode for Missions.
	if(!isEndless) {
		diffMultiplier = normalMode;
	}
	else
	// Survival starts with easy mode, but can be modified in future. TODO
		diffMultiplier = easyMode;
}

function Update() {
	// only check for spawning every so often to avoid performance drop
	if ((Time.timeSinceLevelLoad - lastCheckTime) > checkingDelay) {
		lastCheckTime = Time.timeSinceLevelLoad;
		// Count the zombies in the field.
		undeadCount = GameObject.FindGameObjectsWithTag("zombie").Length;
		minesCount = GameObject.FindGameObjectsWithTag("Landmine").Length;
		if(spawnJobs.Count > 0)
			handleSpawnJobs();
	}
}

function checkSpawnJobs() : int {
	return spawnJobs.Count;
}

function checkUndeadCount() : int {
	return undeadCount;
}

function checkMinesCount() : int {
	return minesCount;
}

function spawnSingleNow(prefab : GameObject, position : Vector2, spread : Vector2) {
	Debug.Log("Spawn time: " + Time.timeSinceLevelLoad);
	var spawn : ZombieSpawnJob = new ZombieSpawnJob(prefab, 0, 1, 1, position, spread);
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
		spawnJobs = waves[0].getWaveSpawns();
		waves.RemoveAt(0);
		waveNum++;
	}
	else {
		Debug.Log("Starting Wave: " + waveNum);
		spawnJobs = waves[waveNum%waves.Count].getWaveSpawns();
		Debug.Log(waves[waveNum%waves.Count].getWaveSpawns().Count);
		Debug.Log(spawnJobs.Count);
		Debug.Log("Wave type: " + waveNum%waves.Count);
		waveNum++;
	// We could step up difficulty by sets of waves. That kind of makes more sense.
	// If we do that, we could put all that work in here.
		switch ((waveNum-1) / waves.Count) {
			case 0: diffMultiplier = easyMode;
					break;
			case 1: diffMultiplier = normalMode;
					break;
			case 2: diffMultiplier = hardMode;
					break;
			case 3: diffMultiplier = insaneMode;
					break;
			default: diffMultiplier = ((waveNum-1) / waves.Count) * 2 - 3;
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
			Debug.Log("Spawn job expired.");
			spawnJobs.RemoveAt(i);
		} else {
			if (spawnJobs[i].compareTag("zombie")) {
				if(!limitZombieCount || undeadCount < maxZombiesLimit) {
					spawnJobs[i].setHealthMultiplier(diffMultiplier);
					if(spawnJobs[i].spawnIfDue())
						undeadCount++;
				}
			}
			else {
				if (spawnJobs[i].compareTag("Landmine")) {
				//Debug.Log("Landmine!");
				if(!limitMinesCount || minesCount < maxMinesCount) {
					spawnJobs[i].setHealthMultiplier(diffMultiplier);
					if(spawnJobs[i].spawnIfDue())
						minesCount++;
				}// else Debug.Log("Too many mines!");
			}
			}
			i++;
		}
	}
}