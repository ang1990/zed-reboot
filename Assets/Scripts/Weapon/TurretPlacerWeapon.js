/*
 * Holds within the general attributes and behaviour of a projectile weapon.
 */

#pragma strict

class TurretPlacerWeapon extends Weapon {
	var rateOfFire : float;
	var firePower : float;
	var bulletSpeed : float;
	var spread : float; // different from scatter. Think of shotgun.
	var bulletsSpawned : int;
	var clipSize : int;
	var reloadTime : float;
	var turretPrefab : GameObject;
	var zedMovement : ZedMovement;
	var zedResources : ZedResources;
	var spawnOffset : Vector2;

	var firingSound : AudioClip;
	var reloadingSound : AudioClip;
	
	
	var bullets : int;
	var bulletsInClip : int;
	var justReloaded : boolean; // for HUD
	var reloadEndTime : float;
	var bulletsInClipBeforeReload : int;
	var lastShotTime : float;
	
	var scatterMaxAngle : float;
	var scatterSaturationFactor : float; // how quickly will the gun saturate 
										 // the scattering angle
	var scatterRelaxationFactor : float;
	var lastShotScatterAngle : float;
	
	
	
			
	function TurretPlacerWeapon(rateOfFire : float, 
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
			turretPrefab : GameObject, 
			owner : GameObject,
			spawnOffset : Vector2,
			firingSound : AudioClip,
			reloadingSound : AudioClip) {
			
		this.rateOfFire = rateOfFire;
		this.firePower = firePower;
		this.bulletSpeed = bulletSpeed;
		this.spread = spread;
		this.bulletsSpawned = bulletsSpawned;
		this.clipSize = clipSize;
		this.reloadTime = reloadTime;
		this.scatterMaxAngle = scatterMaxAngle;
		this.scatterSaturationFactor = scatterSaturationFactor;
		this.scatterRelaxationFactor = scatterRelaxationFactor;
		this.id = id;
		this.turretPrefab = turretPrefab;
		this.owner = owner;
		this.zedMovement = owner.GetComponent(ZedMovement);
		this.zedResources = owner.GetComponent(ZedResources);
		this.spawnOffset = spawnOffset;
		this.firingSound = firingSound;
		this.reloadingSound = reloadingSound;
			
		bullets = 3; // hardcoded, should be dynamic in future implementation.
		reload();
	}
	
	// @Override
	function strike() : boolean {
		var successfulStrike : boolean = false;

		// modifications by perks
		var actualRateOfFire : float = rateOfFire;
		var actualBulletSpeed : float = bulletSpeed;
		var activeWeaponPerks : List.<WeaponPerk> = zedResources.activePerks.getWeaponPerks();
		for (var perk : WeaponPerk in activeWeaponPerks) {
			actualBulletSpeed = actualBulletSpeed*perk.getFirePowerMultiplier();
			actualRateOfFire = actualRateOfFire*perk.getRateOfFireMultiplier();
		}
		
		if (Time.time > reloadEndTime && 
			Time.time > lastShotTime + 1.0/actualRateOfFire ) {
			justReloaded = false;
			if (bulletsInClip > 0) {
				bulletsInClip--;
				successfulStrike = true;
				placeTurret();

				if (bulletsInClip == 0) {
					if(bullets > 0)
						reload();
				}
			} else {
				if(bullets > 0)
					reload();
			}
		}

		return successfulStrike;
	}
	
	function manualReload() {
		if (bulletsInClip < clipSize) {
			reload();
		}
	}
	
	function addClips(clips : int) {
		bullets += (clips * clipSize);
	}
	
	private function reload() {
		bulletsInClipBeforeReload = bulletsInClip;
		bulletsInClip = Mathf.Min(clipSize, bullets);
		bullets -= (bulletsInClip - bulletsInClipBeforeReload);
		justReloaded = bulletsInClip > 0;
		if (justReloaded) {
			reloadEndTime = Time.time + reloadTime;
		}
		if(Time.timeSinceLevelLoad > 0.1)
			playReloadSound();
	}
	
	function increaseScatterAngle() {
		lastShotScatterAngle = getCurrentScatterAngle();	
		lastShotScatterAngle += scatterSaturationFactor*(scatterMaxAngle - lastShotScatterAngle);
	}
	
	function getCurrentScatterAngle() {
		return lastShotScatterAngle*Mathf.Exp(-(Time.time - lastShotTime)*scatterRelaxationFactor);
	}
	
	function getReloadSound() {
		return reloadingSound;
	}
	
	// TODO: Figure out how to introduce a time delay onto the script without breaking it.
	// yield seems to break the whole thing.
	
	function playReloadSound() {
//		Debug.Log("Reload sound going to play.");
		var waitTime : float = reloadTime - reloadingSound.length;
		AudioSource.PlayClipAtPoint(reloadingSound,owner.transform.position);
//		Debug.Log("Reload sound played.");
	}
	
	function getJustReloaded() : boolean {
		return justReloaded;
	}
	
	function falsifyJustReloaded() {
		justReloaded = false;
	}
	
	function getBullets() : int {
		return bullets;
	}
	
	function getBulletsInClip() : int {
		if (Time.time > reloadEndTime) {
			return bulletsInClip;
		} else {
			return bulletsInClipBeforeReload;
		}
	}
	
	function getReloadEndTime() : float {
		return reloadEndTime;
	}
	
	// @Override
	function getClipSize() : int {
		return clipSize; // 0 is melee
	}
	
	function placeTurret() {
		var gunAngle : float = zedMovement.getUpperBodyAngle();
		var newTurret : GameObject = Instantiate(turretPrefab, 
			zedMovement.getPosition(), 
			Quaternion.identity);
					
			newTurret.transform.eulerAngles = new Vector3(0, 0, gunAngle);
					
			newTurret.transform.position.x = newTurret.transform.position.x
					+ Mathf.Cos(Mathf.Deg2Rad*gunAngle)*spawnOffset.x
					- Mathf.Sin(Mathf.Deg2Rad*gunAngle)*spawnOffset.y;
						
			newTurret.transform.position.y = newTurret.transform.position.y
							+ Mathf.Sin(Mathf.Deg2Rad*gunAngle)*spawnOffset.x
							+ Mathf.Cos(Mathf.Deg2Rad*gunAngle)*spawnOffset.y;
	}
}