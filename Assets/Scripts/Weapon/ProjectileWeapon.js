/*
 * Holds within the general attributes and behaviour of a projectile weapon.
 */

#pragma strict

enum WeaponState {Ready, Firing, Reloading, Unselected};

class ProjectileWeapon extends Weapon {

	var currentState : WeaponState = WeaponState.Ready;
	
	var reloadInterrupted : boolean = false;
	
	var rateOfFire : float;
	var actualRateOfFire : float = 0;
	
	var firePower : float;
	
	var bulletSpeed : float;
	var actualBulletSpeed : float = 0;
	
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
	var reloadEndTime : float;
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
		this.actualRateOfFire = rateOfFire;
		this.firePower = firePower;
		this.bulletSpeed = bulletSpeed;
		this.actualBulletSpeed = bulletSpeed;
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
	
	function checkState() {
		switch (currentState) {
			case WeaponState.Unselected:
				break;
			case WeaponState.Ready:
				if (bulletsInClip <= 0) {
					currentState = WeaponState.Reloading;
				} break;
			case WeaponState.Firing:
				if(Time.timeSinceLevelLoad > lastShotTime + 1.0/actualRateOfFire) {
					currentState = WeaponState.Ready;
				}
				break;
			case WeaponState.Reloading:
			// When reloading, you must wait for the reload to finish before the weapon becomes ready.
				
				if(Time.timeSinceLevelLoad > reloadEndTime) {
					finishReload();
					currentState = WeaponState.Ready;
					} break;
			default: break;
			}
	}
	
	function switchOut() {
		if (currentState == WeaponState.Reloading) {
			reloadInterrupted = true;
		}
		currentState = WeaponState.Unselected;
	}
	
	function switchIn() {
		if (reloadInterrupted) {
		// If the reload was interrupted, we delay the reload until the weapon is selected again.
			reloadEndTime = Time.timeSinceLevelLoad + reloadTime;
			currentState = WeaponState.Reloading;
		} else
			currentState = WeaponState.Ready;
	}
	
	// @Override
	function strike() : boolean {
		var successfulStrike : boolean = false;

		if (currentState == WeaponState.Ready) {
		
		currentState = WeaponState.Firing;
		
		// modifications by perks
		var activeWeaponPerks : List.<WeaponPerk> = zedResources.getWeaponPerks();
//		Debug.Log("Number of perks: " + activeWeaponPerks.Count);
		actualBulletSpeed = bulletSpeed;
		actualRateOfFire = rateOfFire;
			for (var perk : WeaponPerk in activeWeaponPerks) {
				actualBulletSpeed = actualBulletSpeed*perk.getFirePowerMultiplier();
				actualRateOfFire = actualRateOfFire*perk.getRateOfFireMultiplier();
			}
			if (bulletsInClip > 0) {
				bulletsInClip--;
				successfulStrike = true;
				// Firing sound.
				playFiringSound();
				
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
					lastShotTime = Time.timeSinceLevelLoad;
				}

				if (bulletsInClip <= 0) {
					startReload();
				}
			} else {
				startReload();
			}
		}

		return successfulStrike;
	}
	
	function manualReload() {
		if (bulletsInClip < clipSize) {
			startReload();
		}
	}
	
	function addClips(clips : int) {
		bullets += (clips * clipSize);
	}
	
	protected function startReload() {
		if(currentState == WeaponState.Ready || currentState == WeaponState.Firing) {
			if (bullets > 0) {
				reloadEndTime = Time.timeSinceLevelLoad + reloadTime;
				currentState = WeaponState.Reloading;
				playReloadSound();
			}
		}
	}
	
	/* Reload has finished here.
		What's gonna happen is:
			
	*/
	function finishReload() {
		var bulletsShort = clipSize - bulletsInClip;
		var bulletsToAdd = Mathf.Min(bulletsShort, bullets);
		bulletsInClip += bulletsToAdd;
		bullets -= bulletsToAdd;
		reloadEndTime = Time.timeSinceLevelLoad + reloadTime;
		playReloadFinishSound();
//		Debug.Log("Reload finished with: " + bulletsInClip);
	}
	
	function increaseScatterAngle() {
		lastShotScatterAngle = getCurrentScatterAngle();	
		lastShotScatterAngle += scatterSaturationFactor*(scatterMaxAngle - lastShotScatterAngle);
	}
	
	function getCurrentScatterAngle() {
		return lastShotScatterAngle*Mathf.Exp(-(Time.timeSinceLevelLoad - lastShotTime)*scatterRelaxationFactor);
	}
	
	function playFiringSound() {
		AudioSource.PlayClipAtPoint(firingSound,owner.transform.position);
	}
	
	function playReloadSound() {
		AudioSource.PlayClipAtPoint(reloadingSound,owner.transform.position);
	}
	
	function playSwitchSound () {
		AudioSource.PlayClipAtPoint(switchSound, owner.transform.position);
	}
	
	function playReloadFinishSound() {
		AudioSource.PlayClipAtPoint(reloadFinishSound, owner.transform.position);
	}
	
	function getBullets() : int {
		return bullets;
	}
	
	function getBulletsInClip() : int {
		return bulletsInClip;
	}
	
	function getReloadEndTime() : float {
		return reloadEndTime;
	}
	
	// @Override
	function getClipSize() : int {
		return clipSize; // 0 is melee
	}
}