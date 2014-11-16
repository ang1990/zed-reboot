/*
 * Holds within the general attributes and behaviour of a projectile weapon.
 */

#pragma strict

class TurretPlacerWeapon extends ProjectileWeapon {
	
	var turretPrefabPath : String = "Prefabs/ScannerTurret";
	var turretPrefab : GameObject;
	
	var firingSoundPath : String = "Sounds/Bleep";
	var reloadingSoundPath : String = "Sounds/Empty Clip";
	var reloadFinishSoundPath : String = "Sounds/Empty Clip";
		
	function TurretPlacerWeapon(owner : GameObject) {
		this.rateOfFire = 0.5;
		this.firepower = 50;
		this.bulletSpeed = 20;
		this.spread = 0;
		this.bulletsSpawned = 1;
		this.clipSize = 1;
		this.reloadTime = 2;
		this.scatterMaxAngle = 0;
		this.scatterSaturationFactor = 0;
		this.scatterRelaxationFactor = 1;
		this.id = "turretplacer";
		this.turretPrefab = Resources.Load(turretPrefabPath) as GameObject;
		this.owner = owner;
		this.zedMovement = owner.GetComponent(ZedMovement);
		this.zedResources = owner.GetComponent(ZedResources);
		this.spawnOffset = new Vector2(1,0);
		this.firingSound = Resources.Load(firingSoundPath) as AudioClip;
		this.reloadingSound = Resources.Load(firingSoundPath) as AudioClip;
		this.reloadFinishSound = Resources.Load(reloadFinishSoundPath) as AudioClip;
			
		bullets = 2; // hardcoded, should be dynamic in future implementation.
		this.bulletsInClip = this.clipSize;
	}
	
	// @Override
	function strike() : boolean {
		var successfulStrike : boolean = false;

		// modifications by perks
		var actualRateOfFire : float = rateOfFire;
		var actualBulletSpeed : float = bulletSpeed;
		var activeWeaponPerks : List.<WeaponPerk> = zedResources.activePerks.getWeaponPerks();
		for (var perk : WeaponPerk in activeWeaponPerks) {
			actualBulletSpeed = actualBulletSpeed*perk.getFirepowerMultiplier();
			actualRateOfFire = actualRateOfFire*perk.getRateOfFireMultiplier();
		}
		
		if (Time.time > reloadEndTime && 
			Time.time > lastShotTime + 1.0/actualRateOfFire ) {
			if (bulletsInClip > 0) {
				bulletsInClip--;
				successfulStrike = true;
				placeTurret();
				AudioSource.PlayClipAtPoint(firingSound,owner.transform.position);

				if (bulletsInClip == 0) {
					if(bullets > 0)
						startReload();
				}
			} else {
				if(bullets > 0)
					startReload();
			}
		}

		return successfulStrike;
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
	
	function isTurretPlacer() : boolean {
		return true;	
	}
}