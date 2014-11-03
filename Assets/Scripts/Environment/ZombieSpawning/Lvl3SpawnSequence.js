/*
 * Specifies the actual sequence of zombies in the survival mode
 * may be attached to any GameObject, preferably environment
 */

#pragma strict

var spawnEngine : ZombieSpawnEngine;
var normalZombiePrefab : GameObject;
var bossZombiePrefab : GameObject;
var singleWave : ZombieWave;

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
	singleWave = new ZombieWave();
	spawnEngine.isEndless = false;

	singleWave.spawnSingle(bossZombiePrefab, 25, Edge.RIGHT);
	singleWave.spawnSingle(bossZombiePrefab, 28, Edge.TOP);
	singleWave.spawnSingle(bossZombiePrefab, 28, Edge.BOTTOM);


	singleWave.spawnContinuous(normalZombiePrefab, 3, 10, 5, Edge.RIGHT);
	singleWave.spawnContinuous(normalZombiePrefab, 3, 10, 5, Edge.TOP);
	singleWave.spawnContinuous(normalZombiePrefab, 3, 10, 5, Edge.BOTTOM);
	singleWave.spawnContinuous(normalZombiePrefab, 8, 10, 5, Edge.RIGHT);
	singleWave.spawnContinuous(normalZombiePrefab, 13, 10, 5, Edge.RIGHT);
	singleWave.spawnContinuous(normalZombiePrefab, 13, 10, 5, Edge.BOTTOM);

	if(ReferenceEquals(singleWave, null))
		Debug.Log("singleWave is null");
	spawnEngine.addWave(singleWave);
	
//	zombieSpawnEngine.spawnContinuous(chaserZombiePrefab, 0, 150, 130, Edge.LEFT);
//	zombieSpawnEngine.spawnContinuous(chaserZombiePrefab, 10, 150, 130, Edge.RIGHT);
//	zombieSpawnEngine.spawnContinuous(chaserZombiePrefab, 10, 150, 130, Edge.TOP);
//	zombieSpawnEngine.spawnContinuous(chaserZombiePrefab, 10, 150, 130, Edge.BOTTOM);
	
	
//	zombieSpawnEngine.spawnContinuous(packZombiePrefab, 0, 1, 3, Vector2(4, 4), Vector2(1, 1));
//	zombieSpawnEngine.spawnContinuous(newZombiePrefab, 0, 50, 25, Vector2(2, 0), Vector2(2, 2));
}

