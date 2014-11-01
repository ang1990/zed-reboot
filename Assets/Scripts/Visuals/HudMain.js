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

var healthBar : GUITexture;
var healthSymbol : Texture2D;
var moneySymbol : Texture2D;
var skillPointSymbol : Texture2D;

private var zedResources : ZedResources;
private var clipSize : int;
private var bullets : int;
private var clipBullets : Texture2D[];
private var weapon : Weapon;
private var lastWeaponId : String;

private var centeredStyle : GUIStyle;

function Start() {
	zedResources = zed.GetComponent(ZedResources);
	bullets = 0;
	//reloadClip();
	lastWeaponId = "";
}

function OnGUI() {
	GUI.skin = null;

	// Skill points and money symbol
	GUI.color.a = 0.7;
	GUI.DrawTexture(Rect(Screen.width/2 + 122, Screen.height - 45, 15, 15), moneySymbol, ScaleMode.StretchToFill);
	GUI.DrawTexture(Rect(Screen.width/2 + 122, Screen.height - 22, 15, 15), skillPointSymbol, ScaleMode.StretchToFill); 

	GUI.skin.font = zedFont;
	GUI.skin.label.fontSize = labelFontSize;

	// Gets current weapon's clip size
	weapon = zedResources.weapons[zedResources.currentWeaponIndex];
	clipSize = weapon.getClipSize();

	// Draws the health bar background for the current health bar
	//GUI.DrawTexture(Rect(Screen.width/2 - 80,  Screen.height - 30, 200, 18), healthBar, ScaleMode.StretchToFill); 
	
	GUI.color = Color(0.0, 0.0, 0.0, 0.4);

	// Score label
	var prevFontSize : int = GUI.skin.label.fontSize;
	var prevStyle : GUIStyle = GUIStyle(GUI.skin.label);
	GUI.skin.label.fontSize = 36;
	centeredStyle = GUIStyle(GUI.skin.label);
	centeredStyle.alignment = TextAnchor.LowerRight;
	GUI.Label(Rect(Screen.width/2 - 90, Screen.height - 145, 200, 120), zedResources.getExperience().ToString(), centeredStyle);
	GUI.skin.label.fontSize = prevFontSize;
	centeredStyle = prevStyle;

	// Skill points and money
	prevFontSize = GUI.skin.label.fontSize;
	prevStyle = GUIStyle(GUI.skin.label);
	GUI.skin.label.fontSize = 22;
	centeredStyle = GUIStyle(GUI.skin.label);
	centeredStyle.alignment = TextAnchor.MiddleLeft;
	GUI.Label(Rect(Screen.width/2 + 140, Screen.height - 99, 200, 120), zedResources.getMoney().ToString(), centeredStyle);
	GUI.Label(Rect(Screen.width/2 + 140, Screen.height - 76, 200, 120), zedResources.getSkillPoints().ToString(), centeredStyle);
	GUI.skin.label.fontSize = prevFontSize;
	centeredStyle = prevStyle;

	// Current health bar
	healthBar.pixelInset.width = 400*zedResources.getHealth()/100;
	
	if (weapon.getId() != null) {
		var melee : boolean = false;
		
		// Weapon image
		if (weapon.getId().Equals("assaultRifle")) {
			revolver.enabled=false;
			assaultRifle.enabled=true;
			shotgun.enabled=false;
			grenadier.enabled=false;
			sword.enabled=false;
		} else if (weapon.getId().Equals("shotgun")) {
			revolver.enabled=false;
			assaultRifle.enabled=false;
			shotgun.enabled=true;
			grenadier.enabled=false;
			sword.enabled=false;
		} else if (weapon.getId().Equals("revolver")) {
			revolver.enabled=true;
			assaultRifle.enabled=false;
			shotgun.enabled=false;
			grenadier.enabled=false;
			sword.enabled=false;
			//GUI.DrawTexture(Rect(Screen.width/2 - 119, 10, 237, 86), revolver, ScaleMode.ScaleAndCrop, true);
		} else if (weapon.getId().Equals("sword")) {
			revolver.enabled=false;
			assaultRifle.enabled=false;
			shotgun.enabled=false;
			grenadier.enabled=false;
			sword.enabled=true;
			melee = true;
		} else if (weapon.getId().Equals("grenadier")) {
			revolver.enabled=false;
			assaultRifle.enabled=false;
			shotgun.enabled=false;
			grenadier.enabled=true;
			sword.enabled=false;
		}
		
		if (!melee) {
			// Clip image
			if (weapon.getJustReloaded() || !weapon.getId().Equals(lastWeaponId)) {
				reloadClip();
			}

			// Total bullets left
			GUI.Label(Rect(Screen.width/2 + clipBullets.length*9/2 - 24 + 27, 80, 100, 100), 
	    		weapon.getBullets().ToString() + "\\"+  weapon.getBulletsInClip().ToString());

			// Clip image overlay
			GUI.DrawTexture(Rect(Screen.width/2 - clipBullets.length*9/2 - 12, 85, 24, 38), leftBracket, ScaleMode.ScaleAndCrop, true);

			var i : int;
			bullets = weapon.getBulletsInClip();
			for (i = 0; i < bullets; i++) {
				GUI.DrawTexture(Rect(Screen.width/2 - clipBullets.length*9/2 - 12 + 5 + i*9, 90, 9, 28), clipBullets[i], ScaleMode.ScaleAndCrop, true);
			}
			GUI.DrawTexture(Rect(Screen.width/2 + clipBullets.length*9/2 - 24, 85, 24, 38), rightBracket, ScaleMode.ScaleAndCrop, true);

			// Clip image background
			GUI.color = Color(0.0, 0.0, 0.0, 0.10);
			for (i = 0; i < clipBullets.length; i++) {
				GUI.DrawTexture(Rect(Screen.width/2 - clipBullets.length*9/2 - 12 + 5 + i*9, 90, 9, 28), clipBullets[i], ScaleMode.ScaleAndCrop, true);
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
	weapon.falsifyJustReloaded();
}

function getRandomBulletTexture() : Texture2D {
	var bulletNumber : int = Mathf.FloorToInt(Random.Range(0, bulletSkins.Length-0.01));
	return bulletSkins[bulletNumber];
}