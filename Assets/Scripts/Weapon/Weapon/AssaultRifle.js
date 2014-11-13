#pragma strict
class AssaultRifle extends ProjectileWeapon {
	
	var bulletPrefabPath : String = "Prefabs/Bullet";
	var firingSoundPath : String = "Weapon SFX/Rifle Fire";
	var reloadingSoundPath : String = "Weapon SFX/Rifle Reload Sound";
	var switchSoundPath : String = "Weapon SFX/Cock Rifle";
	var reloadFinishSoundPath : String = "Weapon SFX/Cock Rifle";
	
	function AssaultRifle(owner : GameObject) {
		this.rateOfFire = 10;
		this.firepower = 40;
		this.bulletSpeed = 20;
		this.spread = 0;
		this.bulletsSpawned = 1;
		this.clipSize = 30;
		this.reloadTime = 1.5;
		this.scatterMaxAngle = 20;
		this.scatterSaturationFactor = 0.1;
		this.scatterRelaxationFactor = 2;
		this.bullets = 10 * this.clipSize;
		this.id = "assaultRifle";
		this.bulletPrefab = Resources.Load(bulletPrefabPath) as GameObject;
		this.owner = owner;
		this.zedMovement = owner.GetComponent(ZedMovement);
		this.zedResources = owner.GetComponent(ZedResources);
		this.spawnOffset = new Vector2(0.63,-0.1);
		this.firingSound = Resources.Load(firingSoundPath) as AudioClip;
		this.reloadingSound = Resources.Load(reloadingSoundPath) as AudioClip;
		this.switchSound = Resources.Load(switchSoundPath) as AudioClip;
		this.reloadFinishSound = Resources.Load(reloadFinishSoundPath) as AudioClip;
		this.weaponType = "scattergun";
		bulletsInClip = this.clipSize;
		this.weaponType = "rifle";
		}
}

