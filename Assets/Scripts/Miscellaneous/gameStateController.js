#pragma strict

import System.Collections.Generic;

enum GameState{starting, waveSpawning, waveSpawnOver, restBetweenWaves, Victory, Defeat}

var interval : float = 0.1;
private var lastCheckTime : float = 0;
var currentState : GameState;
var spawnEngine : ZombieSpawnEngine;
var numWaves : int; // -1 for survival.
var timeBetweenWaves : float;
var bell : AudioClip;
private var zedResources : ZedResources;

function Awake() {
	currentState = GameState.starting;
	zedResources = GameObject.Find("zed").GetComponent(ZedResources) as ZedResources;
	//zombieSpawnEngine = GameObject.Find("environment/zombiespawning").GetComponent(ZombieSpawnEngine) as ZombieSpawnEngine;
}

function Update() {
// Check game state every interval.
	if(Time.timeSinceLevelLoad > lastCheckTime + interval) {
		lastCheckTime = Time.timeSinceLevelLoad;
		Debug.Log("checking victory " + spawnEngine.checkSpawnJobs() + " " + spawnEngine.checkUndeadCount());
		if(spawnEngine.checkSpawnJobs()==0&&spawnEngine.checkUndeadCount()==0&&Time.timeSinceLevelLoad>5) {
			currentState = GameState.Victory;
		}
		if(zedResources.isDefeated()) {
			currentState = GameState.Defeat;
		}
		switch(currentState) {
		// Stub. We may implement wave-based levels. If so, this will be the phase before wave 1.
		// We may implement a beginning phase like this. For now, we just set to waveSpawning.
			case GameState.starting :
		// Issue resolved. There was an issue where the wave was not being initialized properly.
		// The problem was partly due to Unity abstracting away the order in which scripts are executed.
		// We cannot assume that when an item is created and referenced in the same frame
		// that the item will be created BEFORE it is referenced.
		// We will have to enforce the referencing AFTER the creation, hence the waitForEndOfFrame().
				waitForEndOfFrame();
				spawnEngine.startNextWave();
				currentState = GameState.waveSpawning;
				AudioSource.PlayClipAtPoint(bell,transform.position);
				break;
		// If there are no more spawns from this wave, we change state to waveSpawnOver.
			case GameState.waveSpawning :
				break;
//				if(spawnEngine.noMoreSpawns()) {
//					currentState = GameState.waveSpawnOver;
//				} break;
		// The game will wait for Zed to kill all the zombies before continuing to the next state.
			case GameState.waveSpawnOver :
				if(GameObject.FindGameObjectsWithTag("zombie") == null) {
					if(spawnEngine.noMoreWaves()) {
						currentState = GameState.Victory;
					} else currentState = GameState.restBetweenWaves;
				} break;
			case GameState.Victory :
				Camera.main.GetComponent(LevelComplete).openPrompt();
				Time.timeScale = 0;
				break;
			case GameState.restBetweenWaves:
			// NOTE: I'm not confident that this waitTime function works. Please test and confirm.
			//	waitTime(timeBetweenWaves);
				currentState = GameState.waveSpawning;
				spawnEngine.startNextWave();
			case GameState.Defeat:
				Camera.main.GetComponent(NamePrompt).openPrompt();
				Time.timeScale = 0;
				break;
			default:
				break;
		}
	}
}

function waitForEndOfFrame() {
	yield WaitForEndOfFrame();
}

function waitTime(time : float) {
	yield WaitForSeconds(time);
}