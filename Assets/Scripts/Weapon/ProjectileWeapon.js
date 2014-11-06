﻿/*
 * Holds within the general attributes and behaviour of a projectile weapon.
 */

#pragma strict



class ProjectileWeapon extends Weapon {
	var rateOfFire : float;
	var firePower : float;
	var bulletSpeed : float;
	var spread : float; // different from scatter. Think of shotgun.
	var bulletsSpawned : int;
	var clipSize : int;
	var reloadTime : float;
	var bulletPrefab : GameObject;
	var zedMovement : ZedMovement;
	var zedResources : ZedResources;
	var spawnOffset : Vector2;

	var firingSound : AudioClip;
	var reloadingSound : AudioClip;
	var switchSound : AudioClip;
	var reloadFinishSound : AudioClip;
	
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
	
			
	function ProjectileWeapon(rateOfFire : float, 
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
		this.bulletPrefab = bulletPrefab;
		this.owner = owner;
		this.zedMovement = owner.GetComponent(ZedMovement);
		this.zedResources = owner.GetComponent(ZedResources);
		this.spawnOffset = spawnOffset;
		this.firingSound = firingSound;
		this.reloadingSound = reloadingSound;
		this.reloadFinishSound = null;
			
		bullets = 1000; // hardcoded, should be dynamic in future implementation.
		this.bulletsInClip = this.clipSize;
		this.weaponType = "projectileWeapon";
	}
	
	function ProjectileWeapon() {
		this.rateOfFire = 0;
		this.firePower = 0;
		this.bulletSpeed = 0;
		this.spread = 0;
		this.bulletsSpawned = 0;
		this.clipSize = 0;
		this.reloadTime = 0;
		this.scatterMaxAngle = 0;
		this.scatterSaturationFactor = 0;
		this.scatterRelaxationFactor = 0;
		this.id = "null";
		this.bulletPrefab = null;
		this.owner = null;
		this.spawnOffset = Vector2.zero;
		this.firingSound = null;
		this.reloadingSound = null;
		this.reloadFinishSound = null;
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
				
				var gunAngle : float = zedMovement.getUpperBodyAngle();
				// apply scatter
				var scatterAngle = zedResources.getCurrentScatterAngle();
				var shotAngle : float = gunAngle + Random.Range(-0.5*scatterAngle, 0.5*scatterAngle);
				

				for (var b : int = 0; b < bulletsSpawned; b++) {
					var newBullet : GameObject = Instantiate(bulletPrefab, 
						zedMovement.getPosition(), 
						Quaternion.identity);

					var angleWithSpread : float = shotAngle + Random.Range(-0.5*spread, 0.5*spread);
					
					newBullet.transform.eulerAngles = new Vector3(0, 0, angleWithSpread);
					
					newBullet.transform.position.x = newBullet.transform.position.x
							+ Mathf.Cos(Mathf.Deg2Rad*gunAngle)*spawnOffset.x
							- Mathf.Sin(Mathf.Deg2Rad*gunAngle)*spawnOffset.y;
						
					newBullet.transform.position.y = newBullet.transform.position.y
							+ Mathf.Sin(Mathf.Deg2Rad*gunAngle)*spawnOffset.x
							+ Mathf.Cos(Mathf.Deg2Rad*gunAngle)*spawnOffset.y;
				
					
					newBullet.GetComponent(BulletProperties).setPower(firePower);
					newBullet.GetComponent(BulletProperties).setOwner(owner);
					if(newBullet.GetComponent(BulletMovement) != null) {
						newBullet.GetComponent(BulletMovement).setSpeed(actualBulletSpeed);
					}
					else if(newBullet.GetComponent(ExplosiveBulletMovement) != null) {
						newBullet.GetComponent(ExplosiveBulletMovement).setSpeed(actualBulletSpeed);
					}
					
									
					increaseScatterAngle();
					
					lastShotTime = Time.time;
				}
				AudioSource.PlayClipAtPoint(firingSound,owner.transform.position);

				if (bulletsInClip == 0) {
					reload();
				}
			} else {
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
	
	protected function reload() {
		bulletsInClipBeforeReload = bulletsInClip;
		bulletsInClip = Mathf.Min(clipSize, bullets);
		bullets -= (bulletsInClip - bulletsInClipBeforeReload);
		justReloaded = bulletsInClip > 0;
		if (justReloaded) {
			reloadEndTime = Time.time + reloadTime;
		}
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
	
	function playReloadSound() {
		AudioSource.PlayClipAtPoint(reloadingSound,owner.transform.position);
	}
	
	function playSwitchSound () {
		AudioSource.PlayClipAtPoint(switchSound, owner.transform.position);
	}
	
	function getJustReloaded() : boolean {
		return justReloaded;
	}
	
	function finishReload() {
		justReloaded = false;
		AudioSource.PlayClipAtPoint(reloadFinishSound, owner.transform.position);
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
}