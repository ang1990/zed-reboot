#pragma strict
class Shotgun extends ProjectileWeapon {
	
	var bulletPrefabPath : String = "Prefabs/ShotgunBullet";
	var firingSoundPath : String = "Weapon SFX/Shotgun Fire";
	var reloadingSoundPath : String = "Weapon SFX/Shotgun Reload Sound";
	var switchSoundPath : String = "Weapon SFX/Cock Weapon 2Handed";
	var reloadFinishSoundPath : String = "Weapon SFX/Shotgun Reload Finished";
	
	function Shotgun(owner : GameObject) {
		this.rateOfFire = 1;
		this.firePower = 25;
		this.bulletSpeed = 20;
		this.spread = 20;
		this.bulletsSpawned = 9;
		this.clipSize = 7;
		this.reloadTime = 2;
		this.scatterMaxAngle = 15;
		this.scatterSaturationFactor = 0.5;
		this.scatterRelaxationFactor = 2;
		this.id = "shotgun";
		this.bulletPrefab = Resources.Load(bulletPrefabPath) as GameObject;
		this.owner = owner;
		this.zedMovement = owner.GetComponent(ZedMovement);
		this.zedResources = owner.GetComponent(ZedResources);
		this.spawnOffset = new Vector2(0.8,-0.13);
		this.firingSound = Resources.Load(firingSoundPath) as AudioClip;
		this.reloadingSound = Resources.Load(reloadingSoundPath) as AudioClip;
		this.switchSound = Resources.Load(switchSoundPath) as AudioClip;
		this.reloadFinishSound = Resources.Load(reloadFinishSoundPath) as AudioClip;
		this.weaponType = "scattergun";
		bullets = 8 * this.clipSize;
		bulletsInClip = this.clipSize;
		}
}
