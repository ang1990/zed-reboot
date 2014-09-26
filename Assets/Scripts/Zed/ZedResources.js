#pragma strict
import System.Collections.Generic;

/*
*  Zed’s resources, such as health, level, skillPoints, or money.
*/

private var experience : int;
private var health : float;
private var level : int;
private var skillPoints : int = 0;
private var money : int = 0;

private var animatorDead : boolean;
private var promptOpened : boolean = false;

var animator : Animator;

var weapons : Weapon[];
var currentWeaponIndex : int;  // index in weapons-array

var weaponArsenal : WeaponArsenal;
var perkStock : PerkStock;

var zedProperties : ZedProperties;
var activePerks : PerkList;

private var currentScatterAngle : float;
private var lastShotScatterAngle : float;

var gruntSound : AudioClip;

var lastGruntSoundTime : float;

var deathSound : AudioClip;

private var overlay : GameObject;
private var overlayTimeEnd : float;
var overlayTime : float;
var overlayAlphaIncrease : float;
var overlayAlphaDecrease : float;
var maxOverlayAlpha : float;

var slowBloodSpawner : ParticleSystem;
var fastBloodSpawner : ParticleSystem;

/*
 *	HEALTH
 */
function Start() {
	// initializes weapons-array
	weapons = weaponArsenal.initializeArsenal();
	currentWeaponIndex = 0;
	health = 100;
	
	activePerks = new PerkList();
	overlay = GameObject.Find("overlay");
}

function Update() {
	if (Input.GetKeyDown("x")){
		reduceHealth(50);
	} else if (Input.GetKeyDown("m")) {
		changeMoney(10);
	}
	
	if (!isAlive()) {	// Zed is dying
		if (animatorDead && !promptOpened && animator.GetCurrentAnimatorStateInfo(2).IsName("DyingLayer.ZedDead")) {
			Camera.main.GetComponent(NamePrompt).openPrompt();
			promptOpened = true;
			Time.timeScale = 0;
		} else if (!animatorDead) {
			animator.SetTrigger("die");
			slowBloodSpawner.Emit(300);
			fastBloodSpawner.Emit(300);
			animatorDead = true;
			trimUnnecessaryComponents();
		}
	} else if (Time.time > weapons[currentWeaponIndex].getReloadEndTime()) {
		if (Input.GetKeyDown("1") && currentWeaponIndex != 0) {
			currentWeaponIndex = 0;
			animator.SetBool("carrySword", true);
			animator.SetBool("carryRifle", false);
			animator.SetBool("carryPistol", false);
			AudioSource.PlayClipAtPoint(weapons[currentWeaponIndex].getReloadSound(),transform.position);
		} else if (Input.GetKeyDown("2") && currentWeaponIndex != 1) {
			currentWeaponIndex = 1;
			animator.SetBool("carrySword", false);
			animator.SetBool("carryRifle", false);
			animator.SetBool("carryPistol", true);
			AudioSource.PlayClipAtPoint(weapons[currentWeaponIndex].getReloadSound() as AudioClip,transform.position);
		} else if (Input.GetKeyDown("3") && currentWeaponIndex != 2) {
			if (currentWeaponIndex == 3) {
				animator.SetTrigger("changeRifles");
			}
			currentWeaponIndex = 2;
			animator.SetBool("carrySword", false);
			animator.SetBool("carryRifle", true);
			animator.SetBool("carryPistol", false);
			AudioSource.PlayClipAtPoint(weapons[currentWeaponIndex].getReloadSound() as AudioClip,transform.position);
		} else if (Input.GetKeyDown("4") && currentWeaponIndex != 3) {
			if (currentWeaponIndex == 2) {
				animator.SetTrigger("changeRifles");
			}
			currentWeaponIndex = 3;
			animator.SetBool("carrySword", false);
			animator.SetBool("carryRifle", true);
			animator.SetBool("carryPistol", false);
			AudioSource.PlayClipAtPoint(weapons[currentWeaponIndex].getReloadSound() as AudioClip,transform.position);
		} else if (Input.GetKeyDown("5") && currentWeaponIndex != 4) {
			if (currentWeaponIndex == 2) {
				animator.SetTrigger("changeRifles");
			}
			currentWeaponIndex = 4;
			animator.SetBool("carrySword", false);
			animator.SetBool("carryRifle", true);
			animator.SetBool("carryPistol", false);
			AudioSource.PlayClipAtPoint(weapons[currentWeaponIndex].getReloadSound() as AudioClip,transform.position);
		} 
		
	}

	changeOverlay();
}

function reduceHealth(reductionAmount : float) {
	overlayTimeEnd = Time.time + overlayTime;
	changeOverlay();
	if(health <= 0)
		return;
	health -= reductionAmount;
	if (health <= 0) {
		health = 0;
		AudioSource.PlayClipAtPoint(deathSound,transform.position);
	}
	else if(Time.time > lastGruntSoundTime + gruntSound.length) {
			AudioSource.PlayClipAtPoint(gruntSound,transform.position);
			lastGruntSoundTime = Time.time;
		}
}

function changeOverlay() {
	var newAlpha : float;
	if (Time.time < overlayTimeEnd) {
		newAlpha = overlay.renderer.material.color.a + overlayAlphaIncrease*Time.deltaTime;
		if (newAlpha > maxOverlayAlpha) newAlpha = maxOverlayAlpha;
		if (newAlpha <= 1) {
			overlay.renderer.material.color.a = newAlpha;
		} else {
			overlay.renderer.material.color.a = 1;
		}
	} else {
		newAlpha = overlay.renderer.material.color.a - overlayAlphaDecrease*Time.deltaTime;
		if (newAlpha > maxOverlayAlpha) newAlpha = maxOverlayAlpha;
		if (newAlpha > 0) {
			overlay.renderer.material.color.a = newAlpha;
		} else {
			overlay.renderer.material.color.a = 0;
		}
	}
	
	
}

function isAlive() : boolean {
	return (health > 0);
}

function addPerk(perk : Perk) {
	activePerks.addPerk(perk);
}

function trimUnnecessaryComponents() {
	var components = gameObject.GetComponents(typeof(Component));
    for (var component : Component in components) {
            if ((component instanceof ZedMovement) ||
            	(component instanceof ZedStrike)) {
                 Destroy(component);
            }
    }
}

/*
 *	EXPERIENCE & LEVEL
 */ 
function handleZombieKilled(zombieDifficultyLevel : int) {
	gainExperience(zombieDifficultyLevel);
}

function gainExperience(amount : int) {
	experience += amount;
	changeSkillPoints(amount);
	updateLevel();
}

function changeSkillPoints(difference : int) {
	skillPoints += difference;
}

function changeMoney(difference : int) {
	money += difference;
}

function updateLevel() {
	level = Mathf.FloorToInt(Mathf.Log(experience));
}

function getLevel() {
	return level;
}

function getExperience() {
	return experience;
}

function getHealth() {
	return health;
}

function getSkillPoints() {
	return skillPoints;
}

function getMoney() {
	return money;
}

function getCurrentScatterAngle() : float {
	if (weapons[currentWeaponIndex] instanceof ProjectileWeapon) {
		var weapon : ProjectileWeapon = weapons[currentWeaponIndex] as ProjectileWeapon;
		
		var scatterAngle : float = weapon.getCurrentScatterAngle();
		
		// modification by perks
		var activeWeaponPerks : List.<WeaponPerk> = activePerks.getWeaponPerks();
		for (var perk : WeaponPerk in activeWeaponPerks) {
			scatterAngle = scatterAngle * perk.getScatterMultiplier();
		}
		return scatterAngle;
	} else {
		return 0;
	}
}

function swordImpact(power : float) {
	reduceHealth(power*Time.deltaTime);
}
