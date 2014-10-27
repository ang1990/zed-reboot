#pragma strict
class AssaultRifle extends ProjectileWeapon {
	
	var bulletPrefabPath : String = "Prefabs/Bullet";
	var firingSoundPath : String = "Weapon SFX/Rifle Fire";
	var reloadingSoundPath : String = "Weapon SFX/Cock Weapon 2Handed";
	var switchSoundPath : String = "Weapon SFX/Cock Weapon 2Handed";
	
	function AssaultRifle(owner : GameObject) {
		this.rateOfFire = 10;
		this.firePower = 40;
		this.bulletSpeed = 20;
		this.spread = 0;
		this.bulletsSpawned = 1;
		this.clipSize = 30;
		this.reloadTime = 1.5;
		this.scatterMaxAngle = 20;
		this.scatterSaturationFactor = 0.1;
		this.scatterRelaxationFactor = 2;
		this.id = "assaultRifle";
		this.bulletPrefab = Resources.Load(bulletPrefabPath) as GameObject;
		this.owner = owner;
		this.zedMovement = owner.GetComponent(ZedMovement);
		this.zedResources = owner.GetComponent(ZedResources);
		this.spawnOffset = new Vector2(0.8,-0.13);
		this.firingSound = Resources.Load(firingSoundPath) as AudioClip;
		this.reloadingSound = Resources.Load(reloadingSoundPath) as AudioClip;
		this.switchSound = Resources.Load(switchSoundPath) as AudioClip;
		this.weaponType = "scattergun";
		bullets = 1000;
		bulletsInClip = this.clipSize;
		this.weaponType = "rifle";
		}
}
