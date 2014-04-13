﻿#pragma strict

var zedResources : ZedResources;
private var animator : Animator;

var timeOfLastShot : float;
private var totalBulletsSpawned : int;
private var bulletsHit : int;

private final var SWORD : int = EnvironmentAttributes.SWORD_INDEX;
private final var SHOTGUN : int = EnvironmentAttributes.SHOTGUN_INDEX;
private final var ASSAULT_RIFLE : int = EnvironmentAttributes.ASSAULT_RIFLE_INDEX;
private final var PISTOL : int = EnvironmentAttributes.PISTOL_INDEX;

function Awake() {
	totalBulletsSpawned = 0;
	bulletsHit = 0;	
}

function Start() {	
	animator = zedResources.animator;
}

function Update() {
	
	var currentWeapon : Weapon = zedResources.weapons[zedResources.currentWeaponIndex];
	var animatorStateInfo : AnimatorStateInfo;

	if(Input.GetKeyDown("r") && currentWeapon.getReloadEndTime() < Time.time) {
		currentWeapon.manualReload();
	}
	// instantiate when trigger pressed and rate of fire
	// according to weapon in zedResources
	else if (Input.GetMouseButton(0) && Time.timeScale != 0 ) {
		animatorStateInfo = animator.GetCurrentAnimatorStateInfo(1);
		if (animatorReady(animatorStateInfo, zedResources.currentWeaponIndex)) {
			if (currentWeapon instanceof ProjectileWeapon) {
				var successfulStrike : boolean = currentWeapon.strike();
				var currentProjectileWeapon : ProjectileWeapon = currentWeapon as ProjectileWeapon;
				if (successfulStrike) {
					if (zedResources.currentWeaponIndex == SHOTGUN) {
						animator.SetBool("shotgun", true);
					} else {
						animator.SetBool("shotgun", false);
					}
					animator.SetTrigger("projectileStrike");
					totalBulletsSpawned += currentProjectileWeapon.bulletsSpawned;				
				}
			} else if (currentWeapon instanceof MeleeWeapon) {
				var currentMeleeWeapon : MeleeWeapon = currentWeapon as MeleeWeapon;
				animator.SetBool("meleeStrike", true);
			}		
		}
	} 	else if (Input.GetMouseButton(1) && Time.timeScale != 0) {
		currentWeapon.secondaryStrike();
	} else {
		animator.SetBool("meleeStrike", false);
		if (zedResources.currentWeaponIndex == SWORD) {
			var meleeWeapon : MeleeWeapon = currentWeapon as MeleeWeapon;
			animatorStateInfo = animator.GetCurrentAnimatorStateInfo(1);
			if (animatorStateInfo.IsName("SwordUp")) {
				meleeWeapon.strike();  // strike() initializes the attack
			} else if (animatorStateInfo.IsName("SwordStrike")) {
				meleeWeapon.executeStrike(); // executeStrike() computes collisions etc.
			}
		}		
	}
}

function incrementBulletsHit() {
	bulletsHit++;
}

function getPercentageHit() : float {
	if (totalBulletsSpawned == 0) {
		return 0;
	}
	return ((1.0*bulletsHit)/totalBulletsSpawned)*100;
}

function animatorReady(stateInfo : AnimatorStateInfo, currentWeaponIndex : int) : boolean {
	if (currentWeaponIndex == SWORD) {
		return stateInfo.IsName("SwordRelaxed");
	} else if (currentWeaponIndex == SHOTGUN) {
		return stateInfo.IsName("RifleRelaxed");
	} else if (currentWeaponIndex == ASSAULT_RIFLE) {
		return stateInfo.IsName("RifleRelaxed");
	} else if (currentWeaponIndex == PISTOL) {
		return stateInfo.IsName("PistolRelaxed");
	} else {
		return true;
	}
}