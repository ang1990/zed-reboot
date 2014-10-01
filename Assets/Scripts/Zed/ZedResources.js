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
private var defeated : boolean = false;

var animator : Animator;

var weapons : Weapon[];
var currentWeaponIndex : int;  // index in weapons-array

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
	currentWeaponIndex = 0;
	health = 100;
	
	activePerks = new PerkList();
	overlay = GameObject.Find("overlay");
	changeWeapon();
}

function Update() {
	if (Input.GetKeyDown("x")){
		reduceHealth(50);
	} else if (Input.GetKeyDown("m")) {
		changeMoney(10);
	}
	
	if (!isAlive()) {	// Zed is dying
		if (animatorDead && animator.GetCurrentAnimatorStateInfo(2).IsName("DyingLayer.ZedDead")) {
			defeated = true;
		} else if (!animatorDead) {
			animator.SetTrigger("die");
			slowBloodSpawner.Emit(300);
			fastBloodSpawner.Emit(300);
			animatorDead = true;
			trimUnnecessaryComponents();
		}
	// This handles weapon changing. 
	} else if (Time.time > weapons[currentWeaponIndex].getReloadEndTime()) {
		if (Input.GetKeyDown("1") && currentWeaponIndex != 0) {
			if(weapons[0].id != "nullWeapon") {
				currentWeaponIndex = 0;
				changeWeapon();
			}
		} else if (Input.GetKeyDown("2") && currentWeaponIndex != 1) {
			if(weapons[1].id != "nullWeapon") {
				currentWeaponIndex = 1;
				changeWeapon();
			}
		} else if (Input.GetKeyDown("3") && currentWeaponIndex != 2) {
			if(weapons[2].id != "nullWeapon") {
				currentWeaponIndex = 2;
				changeWeapon();
			}
		} else if (Input.GetKeyDown("4") && currentWeaponIndex != 3) {
			if(weapons[3].id != "nullWeapon") {
				currentWeaponIndex = 3;
				changeWeapon();
			}
		} else if (Input.GetKeyDown("5") && currentWeaponIndex != 4) {
			currentWeaponIndex = 4;
		// Right now we don't have an animation for this state. So we just adopt the previous state.
		//	changeWeaponAnimator();
		} 
		
	}

	changeOverlay();
}

function isDefeated() : boolean {
	return defeated;
}

private function changeWeapon() {
	if(weapons[currentWeaponIndex].id == "sword") {
		animator.SetBool("carrySword", true);
		animator.SetBool("carryRifle", false);
		animator.SetBool("carryPistol", false);
	} else if(weapons[currentWeaponIndex].id == "revolver") {
		animator.SetBool("carrySword", false);
		animator.SetBool("carryRifle", false);
		animator.SetBool("carryPistol", true);
	} else if(weapons[currentWeaponIndex].id == "shotgun") {
		if (animator.GetBool("carryRifle")) {
			animator.SetTrigger("changeRifles");
		}
		animator.SetBool("carrySword", false);
		animator.SetBool("carryRifle", true);
		animator.SetBool("carryPistol", false);
	} else if(weapons[currentWeaponIndex].id == "assaultRifle") {
		if (animator.GetBool("carryRifle")) {
			animator.SetTrigger("changeRifles");
		}
		animator.SetBool("carrySword", false);
		animator.SetBool("carryRifle", true);
		animator.SetBool("carryPistol", false);
	}
	AudioSource.PlayClipAtPoint(weapons[currentWeaponIndex].getReloadSound() as AudioClip,transform.position);

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
 
 // Zed gains experience from zombie kills.
 // Account for all that here. For example, HP Vamp on kill, if implemented, wil go here.
 
function handleZombieKilled(zombieDifficultyLevel : int) {
	gainExperience(zombieDifficultyLevel);
}

function gainExperience(amount : int) {
	experience += amount;
	updateLevel();
}

function changeSkillPoints(difference : int) {
	skillPoints += difference;
}

function changeMoney(difference : int) {
	money += difference;
}


// The function controlling Zed's level is here.
// A Square function is used.



function updateLevel() {
	var newLevel : int = expToLevel(experience);
	if(newLevel > level) {
		changeSkillPoints(newLevel-level);
		level = newLevel;
	}
}

// EXP = 50 (1+LEVEL)^2.

private function expToLevel(exp : float) : float {
	return Mathf.FloorToInt(Mathf.Sqrt(exp/50.0))+1;
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
