#pragma strict

var ZombiePrefab : GameObject;
var spawnDelay : float;
var distanceFromEdge : float;

private var lastSpawnTime : float;
private var leftBound : float;
private var rightBound : float;
private var topBound : float;
private var bottomBound : float;
private var spawnLocation : Vector2;

function Start() {
	leftBound = transform.renderer.bounds.min.x - distanceFromEdge;
	rightBound = transform.renderer.bounds.max.x + distanceFromEdge;
	topBound = transform.renderer.bounds.max.y + distanceFromEdge;
	bottomBound = transform.renderer.bounds.min.y - distanceFromEdge;

	lastSpawnTime = Time.time;
	randomizeSpawnLocation();
}

function Update() {
	if ((Time.time - lastSpawnTime) > spawnDelay) {
		var NewZombie : GameObject = Instantiate(ZombiePrefab, spawnLocation, transform.rotation);
		lastSpawnTime = Time.time;
		
		randomizeSpawnLocation();
	}
	
}


function randomizeSpawnLocation() {
	var spawnX : float;
	var spawnY : float;
	var edge : int = Random.Range(0, 4);
	
	if (edge == 0) { // north
		spawnX = Random.Range(leftBound, rightBound);
		spawnY = topBound;
	} else if (edge == 1) { // south
		spawnX = Random.Range(leftBound, rightBound);
		spawnY = bottomBound;
	} else if (edge == 2) { // east
		spawnX = rightBound;
		spawnY = Random.Range(bottomBound, topBound);
	} else if (edge == 3) { // west
		spawnX = leftBound;
		spawnY = Random.Range(bottomBound, topBound);
	}
	
	spawnLocation = new Vector2(spawnX, spawnY);
}