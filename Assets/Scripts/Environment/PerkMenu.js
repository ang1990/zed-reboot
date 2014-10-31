#pragma strict
private var customGuiStyle : GUIStyle;

var turretPrefabs : GameObject[];

var boxTexture : Texture2D;
var zedFont : Font;
var titleFontSize : int;
var buttonFontSize : int;

var purchasedIcon : Texture2D; // checkmark-image
var zedResources : ZedResources;
var perkStock : PerkStock;

var defaultScreenWidth : int = 1400; // for font size calculation
private var screenToDefaultScreenRatio : float;

// all lengths are fractions of Screen.width 
var backgroundWidth : float;
var backgroundHeight : float;
var backgroundCenter : Vector2;
var artilleryBackgroundWidth : float;
var artilleryBackgroundHeight : float;
var artilleryBackgroundCenter : Vector2;
var turretButtonLocation : Vector2;
var buttonHeight : float;
private var buttonSize : Vector2;
var buttonPadding : Vector2;
var descriptionBoxSize : Vector2;

var scannerTurretCost : int;
var miniTurretCost : int;

private var perkMenuActive : boolean = false;

private var centeredStyle : GUIStyle;

function Awake() {
	screenToDefaultScreenRatio = parseFloat(Screen.width)/defaultScreenWidth;
}

function Start() {
	buttonSize = new Vector2(
		(backgroundWidth - (perkStock.CATEGORY_COUNT + 1)*buttonPadding.x)/perkStock.CATEGORY_COUNT,
		buttonHeight);


}

function Update () {
	if (Input.GetKeyDown("space")) {
		if (!perkMenuActive) {
			perkMenuActive = true;
			Time.timeScale = 0;
		} else {
			perkMenuActive = false;
			Time.timeScale = 1;		
		}
	}
}

function OnGUI() {
	var defaultBackground : Texture2D = GUI.skin.box.normal.background;
	if (perkMenuActive) {
		changeFontSize(titleFontSize, GUI.skin.box);
		changeFontSize(buttonFontSize, GUI.skin.button);

		GUI.skin.box.normal.background = boxTexture;
		GUI.Box(
			Rect((backgroundCenter.x - 0.5*backgroundWidth)*Screen.width, 
				(backgroundCenter.y - 0.5*backgroundHeight)*Screen.width, 
				(backgroundWidth*Screen.width), 
				(backgroundHeight*Screen.width)), 
			"Perks");


		/**
		 ********** PERKS **********
		 */
		GUILayout.BeginArea(
			Rect((backgroundCenter.x - 0.5*backgroundWidth)*Screen.width, 
				(backgroundCenter.y - 0.5*backgroundHeight)*Screen.width, 
				(backgroundWidth*Screen.width), 
				(backgroundHeight*Screen.width)));

		// 
		for (var categoryIndex : int = 0; categoryIndex < perkStock.CATEGORY_COUNT; categoryIndex++) {
			for (var perkIndex : int = 0; perkIndex < perkStock.getCategorySize(categoryIndex); perkIndex++) {
				var perk : Perk = perkStock.getPerk(categoryIndex, perkIndex);

				var position : Vector2 = new Vector2(
					(buttonPadding.x + categoryIndex*(buttonSize.x + buttonPadding.x))*Screen.width,
					backgroundHeight*Screen.width - ((perkIndex + 1)*(buttonSize.y + buttonPadding.y))*Screen.width);

				var buttonRect : Rect = new Rect(
					position.x, 
					position.y, 
					buttonSize.x*Screen.width, 
					buttonSize.y*Screen.width);

				var unlocked : boolean = perkStock.isUnlocked(categoryIndex, perkIndex);
				var active : boolean = perkStock.isActive(categoryIndex, perkIndex);

				// disable button if perk is too expensive or locked
				if ((!unlocked || perk.getSkillPointCost() > zedResources.getSkillPoints()) || active) {
					GUI.enabled = false;
				}

				if (GUI.Button(
						buttonRect, 
						GUIContent(perk.getName(), perk.getSkillPointCost() + " SP"))) {

					purchasePerk(categoryIndex, perkIndex);							
				}

				if (active) {
					GUI.DrawTexture(buttonRect, purchasedIcon, ScaleMode.StretchToFill);
				}

				GUI.enabled = true;								
			}
		}

		GUILayout.EndArea();

		/**
		 ********** ARTILLERY **********
		 */
		GUI.Box(
			Rect((artilleryBackgroundCenter.x - 0.5*artilleryBackgroundWidth)*Screen.width, 
				(artilleryBackgroundCenter.y - 0.5*artilleryBackgroundHeight)*Screen.width, 
				(artilleryBackgroundWidth*Screen.width), 
				(artilleryBackgroundHeight*Screen.width)), 
			"Artillery");

		GUILayout.BeginArea(
			Rect((artilleryBackgroundCenter.x - 0.5*artilleryBackgroundWidth)*Screen.width, 
				(artilleryBackgroundCenter.y - 0.5*artilleryBackgroundHeight)*Screen.width, 
				(artilleryBackgroundWidth*Screen.width), 
				(artilleryBackgroundHeight*Screen.width)));

		/*
		 *	Here be buttons
		 */ 
		var artilleryButtonRect : Rect = new Rect(
			turretButtonLocation.x*Screen.width, 
			turretButtonLocation.y*Screen.width, 
			buttonSize.x*Screen.width, 
			buttonSize.y*Screen.width);

		if (scannerTurretCost > zedResources.getMoney()) {
			GUI.enabled = false;
		}

		if (GUI.Button(
				artilleryButtonRect, 
				GUIContent("Scanner\nTurret", scannerTurretCost.ToString() + "G"))) {

			purchaseTurretAmmo();						
		}

		GUI.enabled = true;	

		if (miniTurretCost > zedResources.getMoney()) {
			GUI.enabled = false;
		}

		artilleryButtonRect = new Rect(
			(turretButtonLocation.x + buttonSize.x + buttonPadding.x)*Screen.width , 
			turretButtonLocation.y*Screen.width, 
			buttonSize.x*Screen.width, 
			buttonSize.y*Screen.width);

		if (GUI.Button(
				artilleryButtonRect, 
				GUIContent("Roaming\nMiniturret", "" + miniTurretCost.ToString() + "G"))) {

			purchaseTurret(1);							
		}

		GUI.enabled = true;	

		GUILayout.EndArea();


		GUI.Label(Rect(
				Input.mousePosition.x, 
				Screen.height-Input.mousePosition.y - (descriptionBoxSize.y*Screen.width), 
				(descriptionBoxSize.x*Screen.width), 
				(descriptionBoxSize.y*Screen.width)),
			GUI.tooltip);
	} 

	GUI.skin.box.normal.background = defaultBackground;
	GUI.skin = null;
}

/*
 * Does not check whether Zed has enough skill points
 */
function purchasePerk(categoryIndex : int, perkIndex : int) {	
	var perk : Perk = perkStock.getPerk(categoryIndex, perkIndex);
	zedResources.changeSkillPoints(-perk.getSkillPointCost());
	perkStock.unlock(categoryIndex);
	zedResources.addPerk(perk);
}

function changeFontSize(newsize : int, element : GUIStyle) {
	element.fontSize = newsize*screenToDefaultScreenRatio;
	centeredStyle = GUIStyle(element);
	centeredStyle.alignment = TextAnchor.MiddleCenter;
}

function purchaseTurret(_type : int) {
	if (_type == 0) {
		zedResources.changeMoney(-scannerTurretCost);
		Instantiate(turretPrefabs[0], GameObject.Find("zed").GetComponent(ZedMovement).getPosition(), Quaternion.identity);
	} else if (_type == 1) {
		zedResources.changeMoney(-miniTurretCost);
		Instantiate(turretPrefabs[1], GameObject.Find("zed").GetComponent(ZedMovement).getPosition(), Quaternion.identity);
	}
}

function purchaseTurretAmmo() {
	zedResources.changeMoney(-scannerTurretCost);
	GameObject.Find("zed").GetComponent(ZedResources).increaseWeaponAmmo(5);
}