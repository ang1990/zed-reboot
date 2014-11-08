/*
 * Used by the ZombieSpawning.js-Script. 
 * Combines all necessary information about a job
 */

#pragma strict
import System.Collections.Generic;

class ZombieSpawnJob extends UnityEngine.Object {
	enum LocationMode {
		SINGLE_EDGE, MULTIPLE_EDGE, POSITION
	}
		
	private var prefab : GameObject;
	private var startTime : float;
	private var endTime : float;
	private var spawnDelay : float;
	private var zombiesLeftCount : int;	
	private var spawnConstantly : boolean = false;
	
	private var lastSpawnTime : float;
		
	private var locationMode : LocationMode;
	
	// for single edge
	private var edge : Edge;
	
	// for multiple edges
	private var edges : Edge[];
	
	// for position
	private var position : Vector2;
	private var spread : Vector2;

	private var healthMultiplier : float;
	
	function ZombieSpawnJob(prefab : GameObject,
			startTime : float,
			edge : Edge) {
		this.prefab = prefab;
		this.locationMode = LocationMode.SINGLE_EDGE;
		this.startTime = startTime;
		this.endTime = startTime;
		this.zombiesLeftCount = 1;		
		spawnDelay = 0;
			}
	
	function ZombieSpawnJob(prefab : GameObject, 
			startTime : float, 
			duration : float,
			count : int,
			edge : Edge) {
		this.prefab = prefab;
		this.locationMode = LocationMode.SINGLE_EDGE;	
		this.edge = edge;
		this.startTime = startTime;
		this.endTime = startTime + duration;
		this.zombiesLeftCount = count;		
		spawnDelay = duration/count;
	}	
	
	function ZombieSpawnJob(prefab : GameObject, 
			startTime : float, 
			duration : float,
			count : int,
			edges : Edge[]) {
		this.prefab = prefab;
		this.locationMode = LocationMode.MULTIPLE_EDGE;	
		this.edges = edges;
		this.startTime = startTime;
		this.endTime = startTime + duration;
		this.zombiesLeftCount = count;
		spawnDelay = duration/count;
	}	
	
	function ZombieSpawnJob(prefab : GameObject, 
			startTime : float, 
			duration : float,
			count : int,
			position : Vector2,
			spread : Vector2) {
		this.prefab = prefab;
		this.locationMode = LocationMode.POSITION;	
		this.startTime = startTime;
		this.endTime = startTime + duration;
		this.zombiesLeftCount = count;
		this.position = position;
		this.spread = spread;
		spawnDelay = duration/count;
	}
	
	function ZombieSpawnJob(prefab : GameObject, 
							startTime : float,
							duration : float,
							delayBetweenSpawns : float,
							edge : Edge)
	{
		this.prefab = prefab;
		this.locationMode = LocationMode.SINGLE_EDGE;	
		this.edge = edge;
		this.startTime = startTime;
		this.endTime = startTime + duration;
		this.zombiesLeftCount = 1;		
		spawnDelay = delayBetweenSpawns;
		this.spawnConstantly = true;
	}
	
	function spawnIfDue() : boolean {
		if (Time.timeSinceLevelLoad > startTime) {
			while ((zombiesLeftCount > 0) && (Time.timeSinceLevelLoad - lastSpawnTime) > spawnDelay) {			
				if (lastSpawnTime == 0) {
					lastSpawnTime = startTime + spawnDelay;
				} else {
					lastSpawnTime += spawnDelay;
				}
				
				var spawnPosition2D : Vector2 = getPosition();
				var spawnPosition : Vector3 = new Vector3(spawnPosition2D.x, 
						spawnPosition2D.y, EnvironmentAttributes.zombieZCoordinate);
				var zombie : GameObject = Instantiate(prefab, spawnPosition, Quaternion.identity);
				if (zombie.CompareTag("zombie")) {
					zombie.GetComponent(ZombieResources).multiplyHealth(healthMultiplier);
					zombie.GetComponent(ZombieProperties).multiplyExpGained(Mathf.Pow(healthMultiplier,1.5));
				}
				zombiesLeftCount--;
				if (zombiesLeftCount > 0 && !spawnConstantly) {
					var timeUntilEnd : float = endTime - Time.timeSinceLevelLoad;
					spawnDelay = timeUntilEnd/zombiesLeftCount;
				}
			}
			return true;
		} else return false;
	}
	
	function printDebug() {
		Debug.Log("I am here!");
	}
	
	function isExpired() : boolean {
		return (zombiesLeftCount == 0);
	}
	
	function getPrefab() : GameObject {
		return prefab;
	}
	
	function waveStart() {
		Debug.Log("Wave started at: " + Time.timeSinceLevelLoad);
//		Debug.Log("Spawn starts at: " + (startTime + Time.timeSinceLevelLoad));
		Debug.Log("Wave ends at: " + (this.endTime + Time.timeSinceLevelLoad));
		this.startTime += Time.timeSinceLevelLoad;
		this.endTime += Time.timeSinceLevelLoad;
	}
	
	function compareTag(string : String) : boolean {
		return prefab.CompareTag(string);
	}
	
	private function getPosition() : Vector2 {
		if (locationMode == LocationMode.POSITION) {
			return new Vector2(position.x + Random.Range(-spread.x, spread.x),
					position.y + Random.Range(-spread.y, spread.y));
		} else if (locationMode == LocationMode.MULTIPLE_EDGE) {
			var selectedEdgeIndex : int = Random.Range(0, edges.Length);;
			edge = edges[selectedEdgeIndex];
		}	

		if (edge == Edge.TOP) return (new Vector2(
					Random.Range(EnvironmentAttributes.leftBound, 
							EnvironmentAttributes.rightBound),
							EnvironmentAttributes.topBound) + new Vector2(
								Random.Range(-spread.x, spread.x), 
								Random.Range(-spread.y, spread.y)));
		else if (edge == Edge.BOTTOM)
				return (new Vector2(
					Random.Range(EnvironmentAttributes.leftBound, 
							EnvironmentAttributes.rightBound),
							EnvironmentAttributes.bottomBound) + new Vector2(
								Random.Range(-spread.x, spread.x), 
								Random.Range(-spread.y, spread.y)));
		else if (edge == Edge.LEFT)
					return (new Vector2(
						EnvironmentAttributes.leftBound, 
							Random.Range(EnvironmentAttributes.bottomBound,
								EnvironmentAttributes.topBound)) + new Vector2(
									Random.Range(-spread.x, spread.x), 
									Random.Range(-spread.y, spread.y)));			
		else if (edge == Edge.RIGHT)
					return (new Vector2(
						EnvironmentAttributes.rightBound, 
							Random.Range(EnvironmentAttributes.bottomBound,
								EnvironmentAttributes.topBound)) + new Vector2(
									Random.Range(-spread.x, spread.x), 
									Random.Range(-spread.y, spread.y)));		
		else return Vector2.zero;
	}

	function setHealthMultiplier(healthMultiplier : float) {
		this.healthMultiplier = healthMultiplier;
	}
}

