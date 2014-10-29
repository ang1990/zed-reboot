#pragma strict

/*
*  Manages zed-attack events for the weapon zed is holding.
*/


var zedResources : ZedResources;
private var animator : Animator;

var timeOfLastShot : float;
private var totalBulletsSpawned : int;
private var bulletsHit : int;

private final var SWORD : int = EnvironmentAttributes.SWORD_INDEX;
private final var SHOTGUN : int = EnvironmentAttributes.SHOTGUN_INDEX;
private final var ASSAULT_RIFLE : int = EnvironmentAttributes.ASSAULT_RIFLE_INDEX;
private final var PISTOL : int = EnvironmentAttributes.PISTOL_INDEX;

private var muzzle : SpriteRenderer;

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
	else if (Input.GetMouseButton(0) && Time.timeScale > 0 ) {
		animatorStateInfo = animator.GetCurrentAnimatorStateInfo(1);
		if (animatorReady(animatorStateInfo, currentWeapon.weaponType)) {
			if (currentWeapon instanceof ProjectileWeapon) {
				var successfulStrike : boolean = currentWeapon.strike();
				var currentProjectileWeapon : ProjectileWeapon = currentWeapon as ProjectileWeapon;
				if (successfulStrike) {
					animator.SetTrigger("projectileStrike");
					totalBulletsSpawned += currentProjectileWeapon.bulletsSpawned;			
				}
			} else if (currentWeapon instanceof MeleeWeapon) {
				if (animator.GetCurrentAnimatorStateInfo(1).IsName("WeaponLayer.SwordStrike")) {

					animator.Play("WeaponLayer.SwordRaise");
				} else {
					var currentMeleeWeapon : MeleeWeapon = currentWeapon as MeleeWeapon;
					animator.SetBool("meleeStrike", true);
				}
			} else if(currentWeapon instanceof TurretPlacerWeapon) {
				successfulStrike = currentWeapon.strike();
			}
		} 
	} 	else if (Input.GetMouseButton(1) && Time.timeScale != 0) {
		currentWeapon.secondaryStrike();
	} else {
		animator.SetBool("meleeStrike", false);
		if (currentWeapon.weaponType == "meleeWeapon") {
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

// The weaponType is a variable attached to each weapon.
// It is used to determine what sort of weapon class is used.

function animatorReady(stateInfo : AnimatorStateInfo, weaponType : String) : boolean {
	if (weaponType == "meleeWeapon") {
		return (stateInfo.IsName("WeaponLayer.SwordRelaxed") || stateInfo.IsName("WeaponLayer.SwordStrike") || stateInfo.IsName("WeaponLayer.SwordStrike") || stateInfo.IsName("WeaponLayer.SwordUp"));
	} else if (weaponType == "scattergun") {
		return (stateInfo.IsName("WeaponLayer.ShotgunRelaxed") || stateInfo.IsName("WeaponLayer.ShotGunStrike"));
	} else if (weaponType == "rifle") {
		return (stateInfo.IsName("WeaponLayer.RifleRelaxed") || stateInfo.IsName("WeaponLayer.AssaultRifleStrike"));
	} else if (weaponType == "pistol") {
		return (stateInfo.IsName("WeaponLayer.PistolRelaxed") || stateInfo.IsName("WeaponLayer.PistolStrike"));
	} else if (weaponType == "grenadier") {
		return (stateInfo.IsName("WeaponLayer.GrenadierRelaxed") || stateInfo.IsName("WeaponLayer.GrenadierStrike"));
	}else {
		return true;
	}
}