#pragma strict
private var customGuiStyle : GUIStyle;

var PerkMenu : GameObject;
private var perksMenu : Transform;
private var weaponsMenu : Transform;
private var weaponPerkMenu : Transform;
private var perksPerkMenu : Transform;

var turretPrefabs : GameObject[];

var boxTexture : Texture2D;
var zedFont : Font;
var titleFontSize : int;
var buttonFontSize : int;

var buttonStyle : GUIStyle;

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
	
	perksMenu = PerkMenu.transform.FindChild("Perks");
	weaponsMenu = PerkMenu.transform.FindChild("Weapons");
	perksPerkMenu = PerkMenu.transform.FindChild("Perkstext");
	weaponPerkMenu = PerkMenu.transform.FindChild("Weaponstext");
	
	perksMenu.guiTexture.enabled = false;
	weaponsMenu.guiTexture.enabled = false;
	
	weaponPerkMenu.guiText.enabled = false;
	perksPerkMenu.guiText.enabled = false;
	
	perksMenu.guiTexture.pixelInset.x = 10*Screen.width/100;
	perksMenu.guiTexture.pixelInset.y = 10*Screen.height/100;
	
	perksMenu.guiTexture.pixelInset.height = 80*Screen.height/100;
	perksMenu.guiTexture.pixelInset.width = 50*Screen.width/100;
	
	weaponsMenu.guiTexture.pixelInset.x = 60*Screen.width/100;
	weaponsMenu.guiTexture.pixelInset.y = 10*Screen.height/100;
	
	weaponsMenu.guiTexture.pixelInset.height = 80*Screen.height/100;
	weaponsMenu.guiTexture.pixelInset.width = 30*Screen.width/100;
	
	perksPerkMenu.guiText.pixelOffset.y =  88*Screen.height/100;
	perksPerkMenu.guiText.pixelOffset.x =  35*Screen.width/100;
	
	weaponPerkMenu.guiText.pixelOffset.y = 88*Screen.height/100;
	weaponPerkMenu.guiText.pixelOffset.x = 75*Screen.width/100;
	
}

function Update () {
	if (Input.GetKeyDown("space")) {
		if(perkMenuActive)
			Time.timeScale = 1;
		else
			Time.timeScale = 0;
		perkMenuActive = !perkMenuActive;
	}
}

function OnGUI() {
	var defaultBackground : Texture2D = GUI.skin.box.normal.background;
	if (perkMenuActive) {
	
		perksMenu.guiTexture.enabled = true;
		weaponsMenu.guiTexture.enabled = true;
		perksPerkMenu.guiText.enabled = true;
		weaponPerkMenu.guiText.enabled = true;
		
		changeFontSize(titleFontSize, GUI.skin.box);
		changeFontSize(buttonFontSize, GUI.skin.button);

//		GUI.skin.box.normal.background = boxTexture;
//		GUI.Box(
//			Rect((backgroundCenter.x - 0.5*backgroundWidth)*Screen.width, 
//				(backgroundCenter.y - 0.5*backgroundHeight)*Screen.width, 
//				(backgroundWidth*Screen.width), 
//				(backgroundHeight*Screen.width)), 
//			"Perks");


		/**
		 ********** PERKS **********
		 */
		var areaPosition : Vector2 = new Vector2(0.1*Screen.width+15,0.1*Screen.height);
		var areaWidth : float = 0.5*Screen.width-30;
		var areaHeight : float = 0.8*Screen.height-15;
		GUILayout.BeginArea(
			Rect(
			areaPosition.x,
			areaPosition.y,
			areaWidth,
			areaHeight
		));
//			Rect((backgroundCenter.x - 0.5*backgroundWidth)*Screen.width, 
//				(backgroundCenter.y - 0.5*backgroundHeight)*Screen.width, 
//				(backgroundWidth*Screen.width), 
//				(backgroundHeight*Screen.width)));

		//
		var category : int = perkStock.CATEGORY_COUNT;
		var buttonLength : float = areaWidth/category;
		var buttonTall : float = buttonLength;
		 
		for (var categoryIndex : int = 0; categoryIndex < perkStock.CATEGORY_COUNT; categoryIndex++) {
			for (var perkIndex : int = 0; perkIndex < perkStock.getCategorySize(categoryIndex); perkIndex++) {
				var perk : Perk = perkStock.getPerk(categoryIndex, perkIndex);

				var position : Vector2 = new Vector2(
					(categoryIndex*buttonLength),
					(buttonTall*(perkIndex+1)));

				var buttonRect : Rect = new Rect(
					position.x, 
					position.y, 
					buttonLength, 
					buttonTall);

				var unlocked : boolean = perkStock.isUnlocked(categoryIndex, perkIndex);
				var active : boolean = perkStock.isActive(categoryIndex, perkIndex);

				// disable button if perk is too expensive or locked
				if ((!unlocked || perk.getSkillPointCost() > zedResources.getSkillPoints()) || active) {
					GUI.enabled = false;
				}

				if (GUI.Button(
						buttonRect, 
						GUIContent(perk.getName(), perk.getSkillPointCost() + " SP"),buttonStyle)) {

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
//		GUI.Box(
//			Rect((artilleryBackgroundCenter.x - 0.5*artilleryBackgroundWidth)*Screen.width, 
//				(artilleryBackgroundCenter.y - 0.5*artilleryBackgroundHeight)*Screen.width, 
//				(artilleryBackgroundWidth*Screen.width), 
//				(artilleryBackgroundHeight*Screen.width)), 
//			"Artillery");

		var areaPosition2 : Vector2 = new Vector2(0.6*Screen.width+15,0.1*Screen.height);
		var areaWidth2 : float = 0.3*Screen.width-30;
		var areaHeight2 : float = 0.8*Screen.height-15;
		
		GUILayout.BeginArea(
			Rect(
			areaPosition2.x,
			areaPosition2.y,
			areaWidth2,
			areaHeight2)
//			Rect((artilleryBackgroundCenter.x - 0.5*artilleryBackgroundWidth)*Screen.width, 
//				(artilleryBackgroundCenter.y - 0.5*artilleryBackgroundHeight)*Screen.width, 
//				(artilleryBackgroundWidth*Screen.width), 
//				(artilleryBackgroundHeight*Screen.width)));
		);

		/*
		 *	Here be buttons
		 */ 
		var artilleryButtonRect : Rect = new Rect(
			areaWidth2/2-buttonLength,
			buttonTall*1, 
			buttonLength, 
			buttonTall);

		if (scannerTurretCost > zedResources.getMoney()) {
			GUI.enabled = false;
		}

		if (GUI.Button( artilleryButtonRect, 
				GUIContent("Buy Turret", scannerTurretCost.ToString() + "G"),buttonStyle)) {
			purchaseTurretAmmo();						
		}

		GUI.enabled = true;	
/*
		if (miniTurretCost > zedResources.getMoney()) {
			GUI.enabled = false;
		}

		artilleryButtonRect = new Rect(
			areaWidth2/2,
			buttonTall*1, 
			buttonLength, 
			buttonTall);

		if (GUI.Button(
				artilleryButtonRect, 
				GUIContent("Roaming\nMiniturret", "" + miniTurretCost.ToString() + "G"),buttonStyle)) {

			purchaseTurret(1);							
		}
*/
		GUI.enabled = true;	

		GUILayout.EndArea();


		GUI.Label(Rect(
				Input.mousePosition.x, 
				Screen.height-Input.mousePosition.y - (descriptionBoxSize.y*Screen.width), 
				(descriptionBoxSize.x*Screen.width), 
				(descriptionBoxSize.y*Screen.width)),
			GUI.tooltip);
	} else {
		perksMenu.guiTexture.enabled = false;
		weaponsMenu.guiTexture.enabled = false;
		weaponPerkMenu.guiText.enabled = false;
		perksPerkMenu.guiText.enabled = false;
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
	for(weapon in zedResources.weapons) {
		if(weapon.id == "turretplacer") {
			weapon.addClips(1);
		}
	}
}