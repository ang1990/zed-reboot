#pragma strict

var coinPrefab : GameObject;
var angleDeviationOfDying : float;

var armWeapon : MeleeWeapon;

private var zombieProperties : ZombieProperties;
var health : float;
private var animatorDead : boolean;

var zedResources : ZedResources;

var nullSound : AudioClip;

var zombieDeathSound : AudioClip;
var displayHealthPoints : boolean;

var animator : Animator;

var waitingTimeToBeRemoved : float = 20;

function OnGUI(){
	if (displayHealthPoints) {
		var screenPosition = Camera.main.WorldToScreenPoint(transform.position);
		GUI.Label(new Rect(screenPosition.x, Screen.height-screenPosition.y, 40, 40), ""+health);
	}
}

function Awake() {
	zombieProperties = transform.GetComponent(ZombieProperties);
	animator = GetComponent(Animator);

	health = zombieProperties.getMaxHealth();
	animatorDead = false;
	
	armWeapon = new MeleeWeapon(zombieProperties.getAttackDamage(), "ArmWeapon", gameObject, nullSound, nullSound);
	var armAttackAngles : float[] = [ 	// triplets of: time, angle, length
		0.00,  20.0, 0.40*transform.localScale.x,				// for the raycast
		0.12, -10.0, 0.40*transform.localScale.x,
		0.35, 100.0, 0.55*transform.localScale.x,
		0.50, 135.0, 0.30*transform.localScale.x
	];
	armWeapon.initAngleData(armAttackAngles);
	
	zedResources = GameObject.Find("zed").GetComponent(ZedResources);
}

function Update() {
	// Zombie is dying
	if (!isAlive() && !animatorDead) {
		var animator : Animator = gameObject.GetComponent(Animator);
		animator.SetBool("isDead", true);
		animatorDead = true;
		animator.SetLayerWeight(1, 0); // stop overriding arm movement
		gameObject.tag = "deadZombie";
		gameObject.name = "deadZombie";
		
		// Play death sound.
		AudioSource.PlayClipAtPoint(zombieDeathSound,transform.position);
		trimUnnecessaryComponents();
		TimedObjectDestructor.destroyGameObjectInSeconds(gameObject, waitingTimeToBeRemoved);
				
		// Dying rotation variation
		gameObject.transform.Rotate(new Vector3(0, 0, (Random.value - 0.5)*angleDeviationOfDying));
		
		
		//spriteRenderer.sortingLayerName = "backgroundLayer";
		//spriteRenderer.sortingOrder = -10;
		
		// Tell Zed the difficulty of the zombie which was killed
		zedResources.handleZombieKilled(zombieProperties.getExpGained());
		
		for (var i : int = zombieProperties.getCoinsDroppable(); i > 0; i--) {
			if (Random.Range(0.0, 1.0) < zombieProperties.getCoinDropProbability()) {
				dropCoin();
			}
		}

	} 
}

function reduceHealth(reductionAmount : float) {
	health -= reductionAmount;			
	if (health < 0) {
		health = 0;
	}
}

function isAlive() : boolean {
	return (health > 0);
}

function trimUnnecessaryComponents() {
	var components = gameObject.GetComponents(typeof(Component));
    for (var component : Component in components) {
            if (!(component instanceof Transform) &&
            	!(component instanceof Renderer) &&
            	!(component instanceof Animator)) {
                 Destroy(component);
            }
    }
    if(transform.childCount > 0) {
    	var childrenTransforms = transform.GetComponentsInChildren(Transform) as Transform[];
	    for(var i : int = 0; i < childrenTransforms.Length; i++) {
	    	var child : Transform = childrenTransforms[i];    		
	    	if(child.gameObject.CompareTag("detector")) {
		   		Destroy(child.gameObject);
		   	} else if(child.gameObject.CompareTag("collisionDetector")) {
		   		Destroy(child.gameObject);
		   	}
		   	child.gameObject.isStatic = true;
    	}    	
    }  
    gameObject.isStatic = true;    
}

function dropCoin() {
	Instantiate(coinPrefab, transform.position, Quaternion.identity);
}

function multiplyHealth(healthMultiplier : float) {
	health *= healthMultiplier;
}