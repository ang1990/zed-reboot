#pragma strict

import System.Collections.Generic;

enum GameState{setup, starting, waveSpawning, waveSpawnOver, restBetweenWaves, Victory, Defeat}

var interval : float = 0.1;
private var lastCheckTime : float = 0;
var currentState : GameState;
var spawnEngine : ZombieSpawnEngine;
var numWaves : int; // -1 for survival.
var timeBetweenWaves : float;
var bell : AudioClip;
private var zedResources : ZedResources;
var restTime : float = 5;
var waveOverTime : float;
var waveTextPrefab : GameObject;

function Awake() {
	currentState = GameState.starting;
	zedResources = GameObject.Find("zed").GetComponent(ZedResources) as ZedResources;
	//zombieSpawnEngine = GameObject.Find("environment/zombiespawning").GetComponent(ZombieSpawnEngine) as ZombieSpawnEngine;
}

function Update() {
// Check game state every interval.
	if(Time.timeSinceLevelLoad > lastCheckTime + interval) {
		lastCheckTime = Time.timeSinceLevelLoad;
//		Debug.Log("checking victory " + spawnEngine.checkSpawnJobs() + " " + spawnEngine.checkUndeadCount());
		if(!zedResources.isAlive()) {
			currentState = GameState.Defeat;
		}
		switch(currentState) {
		// Stub. We may implement wave-based levels. If so, this will be the phase before wave 1.
		// We may implement a beginning phase like this. For now, we just set to waveSpawning.
		
		// The setup phase is the initial phase of each level.
		// This is to allow other functions that this controller depends on to process first.
			case GameState.setup :
				waitForEndOfFrame();
				currentState = GameState.starting;
				break;
			case GameState.starting :
				spawnEngine.startNextWave();
				currentState = GameState.waveSpawning;
				break;
		// If there are no more spawns from this wave, we change state to waveSpawnOver.
			case GameState.waveSpawning :
				if(spawnEngine.checkSpawnJobs() == 0) {
					currentState = GameState.waveSpawnOver;
				} break;
		// The game will wait for Zed to kill all the zombies before continuing to the next state.
			case GameState.waveSpawnOver :
				if(spawnEngine.checkUndeadCount() == 0) {
					if(spawnEngine.noMoreWaves()) {
						currentState = GameState.Victory;
					} else {
						waveOverTime = Time.timeSinceLevelLoad;
						currentState = GameState.restBetweenWaves;
						//var text : GameObject = Instantiate(waveTextPrefab, Camera.main.transform.position, Quaternion.identity);
						waveTextPrefab.GetComponent(waveOverlay).waveEnd();
						//text.transform.parent = Camera.main.transform;
					}
				} break;
			case GameState.Victory :
				Debug.Log("Victory!");
				Camera.main.GetComponent(LevelComplete).openPrompt();
				Time.timeScale = 0;
				break;
			// If the rest time is over, continue with the next wave.
			case GameState.restBetweenWaves:
				Debug.Log("Time left to next wave: " + (waveOverTime + restTime - Time.timeSinceLevelLoad));
				if(Time.timeSinceLevelLoad > waveOverTime + restTime) {
					AudioSource.PlayClipAtPoint(bell,transform.position);
					currentState = GameState.starting;
				}
				break;
			case GameState.Defeat:
				Camera.main.GetComponent(NamePrompt).openPrompt();
				Debug.Log("Defeat!");
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