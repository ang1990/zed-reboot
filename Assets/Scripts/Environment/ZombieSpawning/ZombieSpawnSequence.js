/*
 * Specifies the actual sequence of zombies in the survival mode
 * may be attached to any GameObject, preferably environment
 */

#pragma strict

var zombieSpawnEngine : ZombieSpawnEngine;
var normalZombiePrefab : GameObject;
var bossZombiePrefab : GameObject;

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
/*
	zombieSpawnEngine.spawnContinuous(bossZombiePrefab, 0, 10000, 140, Edge.RIGHT);
	zombieSpawnEngine.spawnContinuous(bossZombiePrefab, 120, 10000, 140, Edge.LEFT);

	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 0, 50, 10, Edge.LEFT);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 20, 100, 30, Edge.RIGHT);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 30, 1500, 200, Edge.TOP);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 30, 1500, 200, Edge.BOTTOM);
	
		
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 0, 1500, 100, Edge.LEFT);	
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 10, 10000, 1000, Edge.RIGHT);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 10, 10000, 1000, Edge.TOP);


	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 80, 10000, 400, Edge.LEFT);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 170, 10000, 600, Edge.RIGHT);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 80, 10000, 400, Edge.TOP);
	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 230, 10000, 800, Edge.BOTTOM);

	zombieSpawnEngine.spawnContinuous(normalZombiePrefab, 400, 10000, 1200, Edge.TOP);

*/ //TODO
	
//	zombieSpawnEngine.spawnContinuous(chaserZombiePrefab, 0, 150, 130, Edge.LEFT);
//	zombieSpawnEngine.spawnContinuous(chaserZombiePrefab, 10, 150, 130, Edge.RIGHT);
//	zombieSpawnEngine.spawnContinuous(chaserZombiePrefab, 10, 150, 130, Edge.TOP);
//	zombieSpawnEngine.spawnContinuous(chaserZombiePrefab, 10, 150, 130, Edge.BOTTOM);
	
	
//	zombieSpawnEngine.spawnContinuous(packZombiePrefab, 0, 1, 3, Vector2(4, 4), Vector2(1, 1));
//	zombieSpawnEngine.spawnContinuous(newZombiePrefab, 0, 50, 25, Vector2(2, 0), Vector2(2, 2));
}