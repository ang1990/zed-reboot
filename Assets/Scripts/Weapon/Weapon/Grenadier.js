#pragma strict
class Grenadier extends ProjectileWeapon {
	
	var bulletPrefabPath : String = "Prefabs/ShotgunBullet";
	var firingSoundPath : String = "Weapon SFX/Shotgun Fire";
	var reloadingSoundPath : String = "Weapon SFX/Cock Weapon 2Handed";
	var switchSoundPath : String = "Weapon SFX/Cock Weapon 2Handed";
	
	function Grenadier(owner : GameObject) {
		this.rateOfFire = 1;
		this.firePower = 50;
		this.bulletSpeed = 20;
		this.spread = 20;
		this.bulletsSpawned = 5;
		this.clipSize = 7;
		this.reloadTime = 1;
		this.scatterMaxAngle = 10;
		this.scatterSaturationFactor = 0.5;
		this.scatterRelaxationFactor = 2;
		this.id = "grenadier";
		this.bulletPrefab = Resources.Load(bulletPrefabPath) as GameObject;
		this.owner = owner;
		this.zedMovement = owner.GetComponent(ZedMovement);
		this.zedResources = owner.GetComponent(ZedResources);
		this.spawnOffset = new Vector2(0.8,-0.13);
		this.firingSound = Resources.Load(firingSoundPath) as AudioClip;
		this.reloadingSound = Resources.Load(reloadingSoundPath) as AudioClip;
		this.switchSound = Resources.Load(switchSoundPath) as AudioClip;
		this.weaponType = "grenadier";
		bullets = 1000;
		bulletsInClip = this.clipSize;
		}
}