#pragma strict
class Grenadier extends ProjectileWeapon {
	
	var bulletPrefabPath : String = "Prefabs/GLBullet";
	var firingSoundPath : String = "Weapon SFX/GL Fire";
	var reloadingSoundPath : String = "Weapon SFX/Cock Weapon 2Handed";
	var switchSoundPath : String = "Weapon SFX/Cock Weapon 2Handed";
	var reloadFinishSoundPath : String = "Weapon SFX/Cock Weapon 2Handed";
	
	function Grenadier(owner : GameObject) {
		this.rateOfFire = 1.5;
		this.firepower = 100;
		this.bulletSpeed = 12;
		this.spread = 10;
		this.bulletsSpawned = 1;
		this.clipSize = 6;
		this.reloadTime = 3;
		this.scatterMaxAngle = 20;
		this.scatterSaturationFactor = 0.8;
		this.scatterRelaxationFactor = 1.6;
		this.id = "grenadier";
		this.bulletPrefab = Resources.Load(bulletPrefabPath) as GameObject;
		this.owner = owner;
		this.zedMovement = owner.GetComponent(ZedMovement);
		this.zedResources = owner.GetComponent(ZedResources);
		this.spawnOffset = new Vector2(0.8,-0.13);
		this.firingSound = Resources.Load(firingSoundPath) as AudioClip;
		this.reloadingSound = Resources.Load(reloadingSoundPath) as AudioClip;
		this.switchSound = Resources.Load(switchSoundPath) as AudioClip;
		this.reloadFinishSound = Resources.Load(reloadFinishSoundPath) as AudioClip;
		this.weaponType = "grenadier";
		bullets = 5 * this.clipSize;
		bulletsInClip = this.clipSize;
		}
}