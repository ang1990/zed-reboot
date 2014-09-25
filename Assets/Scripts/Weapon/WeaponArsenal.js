/*
 * Instantiates the weapons that Zed can currently use.
 */

#pragma strict

var zedResources : ZedResources;

var revolverBulletPrefab : GameObject;
var shotgunBulletPrefab : GameObject;
var assaultRifleBulletPrefab : GameObject;
var zed : GameObject;
var clips : AudioClip[];

function initializeArsenal () : Weapon[] {
	var weapons : Weapon[] = new Weapon[3];
			
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
	
	// Sword
	weapons[0] = new MeleeWeapon(4000, "sword", zed, clips[0], clips[1]);
	
	// Revolver
	weapons[1] = new ProjectileWeapon(2, 120, 30, 0, 1, 6, 2, 30, 0.4, 2, 
		"revolver", revolverBulletPrefab, zed, new Vector2(0.81,-0.02), clips[2], clips[3]);
	
	// Shotgun
	weapons[2] = new ProjectileWeapon(1.1, 50, 20, 20, 5, 7, 1, 10, 0.5, 2, 
		"shotgun", shotgunBulletPrefab, zed, new Vector2(0.8,-0.13), clips[4], clips[5]);
	
	// AssaultRifle
//	weapons[3] = new ProjectileWeapon(7, 20, 20, 0, 1, 24, 1, 20, 0.1, 2, 
//		"assaultRifle", assaultRifleBulletPrefab, zed, new Vector2(0.8,-0.13), clips[6], clips[7]);
	
	
	// initialize Sword strike data: time, angle, length (for raycast)
	var swordData : float[] = [
			0.00, -120.0, 1.12,
			0.10,  -80.0, 1.12,
			0.30,  100.0, 1.12,
			0.35,  30.00, 0.00
		];
	(weapons[0] as MeleeWeapon).initAngleData(swordData);
	
	return weapons;
}