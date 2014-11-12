/*
 * Specifies the actual sequence of zombies in the survival mode
 * may be attached to any GameObject, preferably environment
 */

#pragma strict

var spawnEngine : ZombieSpawnEngine;
var normalZombiePrefab : GameObject;
var minePrefab : GameObject;
var bossZombiePrefab : GameObject;
var suicideZombiePrefab : GameObject;
var singleWave : ZombieWave;
var inMap : Vector2;

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
	inMap = getEnvironmentBounds();
	
	singleWave = new ZombieWave();
	spawnEngine.isEndless = false;

	singleWave.spawnContinuous(bossZombiePrefab, 0, 10000, 140, Edge.RIGHT);
	singleWave.spawnContinuous(bossZombiePrefab, 120, 10000, 140, Edge.LEFT);
	
	singleWave.spawnContinuous(minePrefab, 0, 10000, 2500, Vector2.zero, inMap);
	
	singleWave.spawnContinuous(normalZombiePrefab, 0, 1500, 100, Edge.LEFT);	
	singleWave.spawnContinuous(suicideZombiePrefab, 10, 10000, 1000, Edge.RIGHT);
	singleWave.spawnContinuous(normalZombiePrefab, 10, 10000, 1000, Edge.BOTTOM);


	singleWave.spawnContinuous(suicideZombiePrefab, 80, 10000, 400, Edge.LEFT);
	singleWave.spawnContinuous(normalZombiePrefab, 170, 10000, 600, Edge.RIGHT);
	singleWave.spawnContinuous(normalZombiePrefab, 80, 10000, 400, Edge.RIGHT);
	singleWave.spawnContinuous(normalZombiePrefab, 230, 10000, 800, Edge.BOTTOM);
	singleWave.spawnContinuous(suicideZombiePrefab, 45, 10000, 400, Edge.LEFT);
	singleWave.spawnContinuous(suicideZombiePrefab, 80, 10000, 400, Edge.BOTTOM);

	singleWave.spawnContinuous(normalZombiePrefab, 400, 10000, 1200, Edge.LEFT);
	
	spawnEngine.addWave(singleWave);
	
//	zombieSpawnEngine.spawnContinuous(chaserZombiePrefab, 0, 150, 130, Edge.LEFT);
//	zombieSpawnEngine.spawnContinuous(chaserZombiePrefab, 10, 150, 130, Edge.RIGHT);
//	zombieSpawnEngine.spawnContinuous(chaserZombiePrefab, 10, 150, 130, Edge.TOP);
//	zombieSpawnEngine.spawnContinuous(chaserZombiePrefab, 10, 150, 130, Edge.BOTTOM);
	
	
//	zombieSpawnEngine.spawnContinuous(packZombiePrefab, 0, 1, 3, Vector2(4, 4), Vector2(1, 1));
//	zombieSpawnEngine.spawnContinuous(newZombiePrefab, 0, 50, 25, Vector2(2, 0), Vector2(2, 2));
}

function getEnvironmentBounds() : Vector2 {
	return Vector2(EnvironmentAttributes.rightBound, EnvironmentAttributes.topBound);
}