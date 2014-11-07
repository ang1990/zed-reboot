#pragma strict
class Revolver extends ProjectileWeapon {
	
	var bulletPrefabPath : String = "Prefabs/Bullet";
	var firingSoundPath : String = "Weapon SFX/Pistol Fire";
	var reloadingSoundPath : String = "Weapon SFX/Revolver Reload Init";
	var switchSoundPath : String = "Weapon SFX/Cock Weapon 1Handed";
	var reloadFinishSoundPath : String = "Weapon SFX/Cock Weapon 1Handed";
	
	function Revolver(owner : GameObject) {
		this.rateOfFire = 2.5;
		this.firePower = 120;
		this.bulletSpeed = 30;
		this.spread = 0;
		this.bulletsSpawned = 1;
		this.clipSize = 6;
		this.reloadTime = 2;
		this.scatterMaxAngle = 30;
		this.scatterSaturationFactor = 0.4;
		this.scatterRelaxationFactor = 2;
		this.id = "revolver";
		this.bulletPrefab = Resources.Load(bulletPrefabPath) as GameObject;
		this.owner = owner;
		this.zedMovement = owner.GetComponent(ZedMovement);
		this.zedResources = owner.GetComponent(ZedResources);
		this.spawnOffset = new Vector2(0.81,-0.02);
		this.firingSound = Resources.Load(firingSoundPath) as AudioClip;
		this.reloadingSound = Resources.Load(reloadingSoundPath) as AudioClip;
		this.switchSound = Resources.Load(switchSoundPath) as AudioClip;
		this.reloadFinishSound = Resources.Load(reloadFinishSoundPath) as AudioClip;
		this.weaponType = "pistol";
		bullets = 15 * this.clipSize;
		bulletsInClip = this.clipSize;
		}
}