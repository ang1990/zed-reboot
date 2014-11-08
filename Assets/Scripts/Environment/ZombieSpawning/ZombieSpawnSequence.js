/*
 * Specifies the actual sequence of zombies in the survival mode
 * may be attached to any GameObject, preferably environment
 */

#pragma strict

import System.Collections.Generic;

var zombieSpawnEngine : ZombieSpawnEngine;
var normalZombiePrefab : GameObject;
var bossZombiePrefab : GameObject;
var suicideZombiePrefab : GameObject;

var waves : List.<ZombieWave>;

function Start () {
	// possible commands:
	// spawnSingle(prefab, time, position)
	// spawnSingle(prefab, time, position, spread)
	// spawnSingle(prefab, time, edge)
	// spawnSingle(prefab, time, edges) [To do]
	
	// spawnContinuous(prefab, startTime, duration, zombieNumber, position)
	// spawnContinuous(prefab, startTime, duration, zombieNumber, position, spread)
	// spawnContinuous(prefab, startTime, duration, zombieNumber, edge)
	// spawnContinuous(prefab, startTime, duration, zombieNumber, edges) [to do]

	var numWaves : int = 1;

	zombieSpawnEngine.isEndless = true;

	for (var i : int = 0; i < numWaves; i++)
		waves.Add(new ZombieWave());

	// Basic wave.		
	waves[0].spawnContinuous(normalZombiePrefab, 0, 12, 6, Edge.LEFT);	
	waves[0].spawnContinuous(normalZombiePrefab, 5, 12, 6, Edge.BOTTOM);
	waves[0].spawnContinuous(normalZombiePrefab, 5, 12, 6, Edge.TOP);
	waves[0].spawnContinuous(normalZombiePrefab, 0, 12, 6, Edge.RIGHT);
/*	// Basic wave plus more zombies.
	waves[1].spawnContinuous(normalZombiePrefab, 2, 12, 9, Edge.LEFT);	
	waves[1].spawnContinuous(normalZombiePrefab, 4, 12, 6, Edge.BOTTOM);
	waves[1].spawnContinuous(normalZombiePrefab, 4, 12, 6, Edge.TOP);
	waves[1].spawnContinuous(normalZombiePrefab, 2, 12, 9, Edge.RIGHT);
	// Suicide wave.
	waves[2].spawnContinuous(suicideZombiePrefab, 0, 12, 2, Edge.LEFT);	
	waves[2].spawnContinuous(normalZombiePrefab, 0, 12, 6, Edge.LEFT);
	waves[2].spawnContinuous(normalZombiePrefab, 0, 12, 6, Edge.BOTTOM);
	waves[2].spawnContinuous(normalZombiePrefab, 0, 12, 6, Edge.TOP);
	waves[2].spawnContinuous(normalZombiePrefab, 0, 12, 6, Edge.RIGHT);
	waves[2].spawnContinuous(suicideZombiePrefab, 0, 12, 2, Edge.RIGHT);
	// Single boss wave + normals.
	waves[3].spawnSingle(bossZombiePrefab, 0, Edge.RIGHT);
	waves[3].spawnContinuous(normalZombiePrefab, 0, 12, 3, Edge.LEFT);	
	waves[3].spawnContinuous(normalZombiePrefab, 5, 12, 3, Edge.BOTTOM);
	waves[3].spawnContinuous(normalZombiePrefab, 5, 12, 3, Edge.TOP);
	waves[3].spawnContinuous(normalZombiePrefab, 0, 12, 3, Edge.RIGHT);
	// More bosses / suicides / normals.
	waves[4].spawnSingle(bossZombiePrefab, 0, Edge.RIGHT);
	waves[4].spawnSingle(bossZombiePrefab, 2, Edge.LEFT);
	waves[4].spawnContinuous(suicideZombiePrefab, 0, 12, 2, Edge.LEFT);	
	waves[4].spawnContinuous(normalZombiePrefab, 0, 12, 6, Edge.LEFT);
	waves[4].spawnContinuous(normalZombiePrefab, 0, 12, 6, Edge.BOTTOM);
	waves[4].spawnSingle(suicideZombiePrefab, 15, Edge.TOP);
	waves[4].spawnSingle(suicideZombiePrefab, 20, Edge.BOTTOM);
	waves[4].spawnContinuous(normalZombiePrefab, 0, 12, 6, Edge.TOP);
	waves[4].spawnContinuous(normalZombiePrefab, 0, 12, 6, Edge.RIGHT);
	waves[4].spawnContinuous(suicideZombiePrefab, 0, 12, 2, Edge.RIGHT);
	*/
	for (wave in waves) {
		zombieSpawnEngine.addWave(wave);
	}
}