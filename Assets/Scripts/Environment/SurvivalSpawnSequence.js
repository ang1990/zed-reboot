/*
 * Specifies the actual sequence of zombies in the survival mode
 * may be attached to any GameObject, preferably environment
 */

#pragma strict

var zombieSpawnEngine : ZombieSpawnEngine;
var normalZombiePrefab : GameObject;
var bossZombiePrefab : GameObject;

var difficultyStepTime : float = 180;

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
// Bosses
/*	zombieSpawnEngine.spawnContinuous(bossZombiePrefab, 0, 10000, 140, Edge.RIGHT);
	zombieSpawnEngine.spawnContinuous(bossZombiePrefab, 120, 10000, 140, Edge.LEFT);
// Initial set
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 0, 50, 10, Edge.LEFT);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 10, 100, 30, Edge.RIGHT);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 20, 1500, 200, Edge.TOP);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 30, 1500, 200, Edge.BOTTOM);
	
		
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 0, 1500, 100, Edge.LEFT);	
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 10, 10000, 1000, Edge.RIGHT);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 10, 10000, 1000, Edge.TOP);


	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 80, 10000, 400, Edge.LEFT);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 170, 10000, 600, Edge.RIGHT);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 80, 10000, 400, Edge.TOP);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 230, 10000, 800, Edge.BOTTOM);

	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 400, 10000, 1200, Edge.TOP);*/
}