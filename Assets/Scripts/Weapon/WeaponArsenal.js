/*
 * Instantiates the weapons that Zed can currently use.
 */

#pragma strict

var zedResources : ZedResources;

var revolverBulletPrefab : GameObject;
var shotgunBulletPrefab : GameObject;
var assaultRifleBulletPrefab : GameObject;
var turretPrefabs: GameObject;
var zed : GameObject;
var clips : AudioClip[];

private var numWeapons : int = 6;

// Survival arsenal has all the weapons that we will use in Survival Mode.

function survivalArsenal() : Weapon[] {
	var weapons : Weapon[] = new Weapon[numWeapons];
	
	weapons[0] = getSword();
	weapons[1] = getRevolver();
	weapons[2] = getShotgun();
	weapons[3] = getAssaultRifle();
	weapons[4] = getGrenadier();
	weapons[5] = getTurretPlacer();
	return weapons;
}

// Starting Arsenal contains a base revolver only. We may implement weapon pickups if possible.

function startingArsenal() : Weapon[] {
	var weapons : Weapon[] = new Weapon[numWeapons];
	weapons[0] = getRevolver();
	for(var i : int = 1; i < numWeapons; i++) {
		weapons[i] = getNullWeapon();
	}
	return weapons;
}

// Lvl2 arsenal has revolver, shotgun, and AR.

function lvl2Arsenal() : Weapon[] {
	var weapons : Weapon[] = new Weapon[numWeapons];
	
	weapons[0] = getRevolver();
	weapons[1] = getShotgun();
	weapons[2] = getAssaultRifle();
	for(var i : int = 3; i < numWeapons; i++) {
		weapons[i] = getNullWeapon();
	}
	return weapons;
}

function getSword() : MeleeWeapon {
	var sword : MeleeWeapon = new MeleeWeapon(4000, "sword", zed, clips[0], clips[1]);
		// initialize Sword strike data: time, angle, length (for raycast)
	var swordData : float[] = [
			0.00, -120.0, 1.12,
			0.10,  -80.0, 1.12,
			0.30,  100.0, 1.12,
			0.35,  30.00, 0.00
		];
	sword.initAngleData(swordData);
	return sword;
}

private function getNullWeapon() : ProjectileWeapon {
	return new ProjectileWeapon(0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 
		"nullWeapon", revolverBulletPrefab, zed, Vector2.zero, clips[4], clips[5]);
}

	/*
	Parameters in order for projectile weapon:
			rateOfFire : float, 
			firePower : float, 
			bulletSpeed : float,
			spread : float,
			bulletsSpawned : int,
			clipSize : int,
			reloadTime : float,
			scatterMaxAngle : float,
			scatterSaturationFactor : float,
			scatterRelaxationFactor : float,
			id : String,
			bulletPrefab : GameObject, 
			zed : GameObject,
			spawnOffset : Vector2,
			firingSound : AudioClip,
			reloadingSound : AudioClip
	*/

/*

	var weapon : ProjectileWeapon = new ProjectileWeapon(2, 120, 30, 0, 1, 6, 2, 30, 0.4, 2, 
		"revolver", revolverBulletPrefab, zed, new Vector2(0.81,-0.02), clips[2], clips[3]);
	weapon.weaponType = "pistol";
*/

private function getRevolver() : ProjectileWeapon {
	var weapon : Revolver = Revolver(zed);
	return weapon;
}

private function getShotgun() : ProjectileWeapon {
	var weapon : Shotgun = Shotgun(zed);
	return weapon;
}

private function getAssaultRifle() : ProjectileWeapon {
	var weapon : AssaultRifle = AssaultRifle(zed);
	return weapon;
	
}

private function getGrenadier() : ProjectileWeapon {
	var weapon : Grenadier = Grenadier(zed);
	return weapon;
}

private function getTurretPlacer() : TurretPlacerWeapon {
	return new TurretPlacerWeapon(1.1, 50, 20, 20, 1, 1, 1, 10, 0.5, 2, 
		"turretplacer", turretPrefabs, zed, new Vector2(1,0), clips[4], clips[5]);
}
