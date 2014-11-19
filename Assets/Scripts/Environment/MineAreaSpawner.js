#pragma strict

import System.Collections.Generic;

var minePrefab : GameObject;
var mineArray : Array;

private var timeBetweenUpdates : float = 0.1;
private var timeSinceLastUpdate : float;
var maxMines : int;
private var minesInField : int = 0;
var timeToSpawnMine : float;
var chanceToSpawn : float;
private var timeLeftToSpawn : float;
private var spawnEngine : ZombieSpawnEngine;

private enum MineSpawnState {Waiting, Spawn};
private var currentState : MineSpawnState = MineSpawnState.Waiting;

function Start () {
	renderer.enabled = false;
	timeSinceLastUpdate = Time.timeSinceLevelLoad;
	if(maxMines == 0) maxMines = 1;
	if(timeToSpawnMine <= 0) timeToSpawnMine = 5;
	if(chanceToSpawn <= 0) chanceToSpawn = 0.5;
	spawnEngine = GameObject.Find("environment").GetComponent(ZombieSpawnEngine);
	mineArray = new Array();
	timeLeftToSpawn = timeToSpawnMine;
}

function Update () {
	if(Time.timeSinceLevelLoad > timeSinceLastUpdate + timeBetweenUpdates) {
		checkMines();
		if(minesInField < maxMines) {
			switch(currentState) {
				case MineSpawnState.Waiting:
					timeLeftToSpawn -= (Time.timeSinceLevelLoad - timeSinceLastUpdate);
					if(timeLeftToSpawn < 0) {
						currentState = MineSpawnState.Spawn;
					}
					break;
				case MineSpawnState.Spawn:
					if(Random.Range(0.0,1.0) < chanceToSpawn) {
						mineArray.Add(Instantiate(minePrefab, spotInBox(), Quaternion.identity) as GameObject);
						minesInField++;
					}
					timeLeftToSpawn = timeToSpawnMine;
					currentState = MineSpawnState.Waiting;
					break;
				default: break;
			}
		}
		timeSinceLastUpdate = Time.timeSinceLevelLoad;
	}
}

private function spotInBox() : Vector3 {
	var currentPosition : Vector3 = transform.position;
	var randomDev : Vector2;
	randomDev.x = renderer.bounds.size.x * Random.Range(-0.5,0.5);
	randomDev.y = renderer.bounds.size.y * Random.Range(-0.5,0.5);
	currentPosition.x += randomDev.x;
	currentPosition.y += randomDev.y;
	currentPosition.z = 0;
	return currentPosition;
}

function checkMines() {
	for (var i : int = 0; i < mineArray.length; i++) {
		if(mineArray[i] == null) {
			mineArray.RemoveAt(i);
		}
	}
	minesInField = mineArray.length;
}


