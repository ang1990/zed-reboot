/*
 * The main HUD has the weapon, bullet, health, skillpoint and money information.
 */

#pragma strict

var zedFont : Font;
var labelFontSize : int;

var zed : GameObject;

var arsenal : GUITexture;
var sword : GUITexture;
var revolver : GUITexture;
var assaultRifle : GUITexture;
var shotgun : GUITexture;
var grenadier : GUITexture;
var leftBracket : Texture2D;
var rightBracket : Texture2D;
var bulletSkins : Texture2D[];
var clip : GUIText;
var score : GUIText;
var bullet : GUITexture;

private var allBullets : List.<GUITexture>;
private var initBulletx : float;
private var initBullety : float;

private var maxClipSize : int;


var healthBar : GUITexture;
var money : GUIText;
var skillPoint : GUIText;

private var zedResources : ZedResources;
private var clipSize : int;
private var bullets : int;
private var clipBullets : Texture2D[];
private var weapon : Weapon;
private var lastWeaponId : String;
private var currentWeaponId : String;

private var centeredStyle : GUIStyle;

function Start() {
	zedResources = zed.GetComponent(ZedResources);
	bullets = 0;
	//reloadClip();
	lastWeaponId = "";
	
	allBullets = new List.<GUITexture>();
	initBulletx = bullet.pixelInset.x;
	initBullety = bullet.pixelInset.y;
	maxClipSize = 0;
}

function OnGUI() {
	GUI.skin = null;

	// Skill points and money symbol
	GUI.color.a = 0.7;
	//GUI.DrawTexture(Rect(Screen.width/2 + 122, Screen.height - 45, 15, 15), moneySymbol, ScaleMode.StretchToFill);
	//GUI.DrawTexture(Rect(Screen.width/2 + 122, Screen.height - 22, 15, 15), skillPointSymbol, ScaleMode.StretchToFill); 

	GUI.skin.font = zedFont;
	GUI.skin.label.fontSize = labelFontSize;
	
	if(lastWeaponId != "")
		lastWeaponId = weapon.getId();
	
	// Gets current weapon's clip size
	weapon = zedResources.weapons[zedResources.currentWeaponIndex];
	clipSize = weapon.getClipSize();
	
	currentWeaponId = weapon.getId();
	
	if(currentWeaponId != lastWeaponId) {
//		Debug.Log("weapon change");
		clipSize = weapon.getClipSize();
		
		var j : int;
		if (clipSize > maxClipSize) {
			for (j = maxClipSize; j<clipSize; j++) {
				bullet.pixelInset.x = bullet.pixelInset.x + ((bullet.pixelInset.width + 2)*j);
				allBullets.Add(Instantiate(bullet));
				bullet.pixelInset.x = initBulletx;
				bullet.pixelInset.y = initBullety;
			}
			maxClipSize = clipSize;
		}
	}

	// Draws the health bar background for the current health bar
	//GUI.DrawTexture(Rect(Screen.width/2 - 80,  Screen.height - 30, 200, 18), healthBar, ScaleMode.StretchToFill); 
	
	GUI.color = Color(0.0, 0.0, 0.0, 0.4);

	// Score label
	var prevFontSize : int = GUI.skin.label.fontSize;
	var prevStyle : GUIStyle = GUIStyle(GUI.skin.label);
	GUI.skin.label.fontSize = 36;
	centeredStyle = GUIStyle(GUI.skin.label);
	centeredStyle.alignment = TextAnchor.LowerRight;
	
	score.text = zedResources.getExperience().ToString();
	//GUI.Label(Rect(Screen.width/2 - 90, Screen.height - 145, 200, 120), zedResources.getExperience().ToString(), centeredStyle);
	GUI.skin.label.fontSize = prevFontSize;
	centeredStyle = prevStyle;

	// Skill points and money
	prevFontSize = GUI.skin.label.fontSize;
	prevStyle = GUIStyle(GUI.skin.label);
	GUI.skin.label.fontSize = 22;
	centeredStyle = GUIStyle(GUI.skin.label);
	centeredStyle.alignment = TextAnchor.MiddleLeft;
	
	money.text = zedResources.getMoney().ToString();
	skillPoint.text = zedResources.getSkillPoints().ToString();
	//GUI.Label(Rect(Screen.width/2 + 140, Screen.height - 99, 200, 120), zedResources.getMoney().ToString(), centeredStyle);
	//GUI.Label(Rect(Screen.width/2 + 140, Screen.height - 76, 200, 120), zedResources.getSkillPoints().ToString(), centeredStyle);
	GUI.skin.label.fontSize = prevFontSize;
	centeredStyle = prevStyle;

	// Current health bar
	healthBar.pixelInset.width = 400*zedResources.getHealth()/100;
	
	if(weapon.getId() != null){
		var melee : boolean = false;
		
		// Weapon image
		changeHUDWeapon(weapon.getId());
		
		if(!melee) {
			// Clip image
/*			if (weapon.getJustReloaded() || !weapon.getId().Equals(lastWeaponId)) {
				reloadClip();
			}
*/
			// Total bullets left
			if(weapon.getId().Equals("sword")) {
				clip.guiText.enabled = false;
			} else {
				clip.guiText.enabled = true;
				clip.text = weapon.getBulletsInClip().ToString()+"\\"+weapon.getBullets().ToString();
			}

			// Clip image overlay

			var i : int;
			bullets = weapon.getBulletsInClip();
			for (i = 0; i < allBullets.Count; i++) {
				if(i<bullets)
					allBullets[i].enabled=true;
				else
					allBullets[i].enabled=false;
			}
		}
	}
	
	lastWeaponId = weapon.getId();

	GUI.skin = null;
}

function reloadClip() {
	clipSize = weapon.getClipSize();
	clipBullets = new Texture2D[clipSize];
	for (var i = 0; i < clipSize; i++) {
		clipBullets[i] = getRandomBulletTexture();
	}
	//weapon.finishReload();
}

function getRandomBulletTexture() : Texture2D {
	var bulletNumber : int = Mathf.FloorToInt(Random.Range(0, bulletSkins.Length-0.01));
	return bulletSkins[bulletNumber];
}

function changeHUDWeapon (id : String) {
	revolver.enabled=false;
	assaultRifle.enabled=false;
	shotgun.enabled=false;
	grenadier.enabled=false;
	sword.enabled=false;
	if (weapon.getId().Equals("assaultRifle")) {
		assaultRifle.enabled=true;
	} else if (weapon.getId().Equals("shotgun")) {
		shotgun.enabled=true;
	} else if (weapon.getId().Equals("revolver")) {
		revolver.enabled=true;
	} else if (weapon.getId().Equals("sword")) {
		sword.enabled=true;
	} else if (weapon.getId().Equals("grenadier")) {
		grenadier.enabled=true;
	}
}