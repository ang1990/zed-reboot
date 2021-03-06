/*
 * Holds both the visuals and functionality of the Main Menu.
 */

#pragma strict

var zedFont : Font;
var buttonFontSizeMultiplier : float;
var titleFontSizeMultiplier : float;
var defaultFontSize : float = 16; // for font size calculation
var defaultScreenWidth : int = 1600; // for font size calculation
private var screenToDefaultScreenRatio : float; // for scaling across different resolutions

var titleWidth : float;
var titleHeight : float;
var buttonWidth : float;  // fraction of Screen.width
var buttonHeight : float; // fraction of Screen.width
var titleLabelY : float; // fraction of Screen.height
var lvButton1 : float; 
var lvButton2 : float;
var lvButton3 : float;
var lvResetButton: float;
var returnButton : float;

var lockedLevelClicked : boolean = false;

var lvName1 : String;
var lvName2 : String;
var lvName3 : String;
var mainMenuName : String;

function Awake() {
	screenToDefaultScreenRatio = parseFloat(Screen.width)/defaultScreenWidth;
}

function OnGUI() {
	GUI.skin = null;
	GUI.skin.font = zedFont;
	GUI.skin.button.fontSize = defaultFontSize*buttonFontSizeMultiplier*screenToDefaultScreenRatio;
	GUI.skin.label.fontSize = 96;

	// Title
	var centeredStyle = GUIStyle(GUI.skin.label);
    centeredStyle.alignment = TextAnchor.UpperCenter;
	var buttonRect : Rect = new Rect((0.5 - (titleWidth/2))*Screen.width,
			titleLabelY*Screen.height, 
			titleWidth*Screen.width,
			titleHeight*Screen.width); // height until first button
	GUI.Label(buttonRect, GUIContent("zed"), centeredStyle);
	
	// Level 1, 2 and 3.
	if (newButton(lvButton1, "Level 1")) {
		Time.timeScale = 1;
		Application.LoadLevel("cutin1");
	}
	
	if (newButton(lvButton2, "Level 2")) {
		if (PlayerPrefs.HasKey("Level1")) {
			Debug.Log("Level1 key found");
			Time.timeScale = 1;
			Application.LoadLevel(lvName2);
		}
		else {
			Debug.Log("Level1 key not found");
			lockedLevelClicked = true;
		}
	}

	if (newButton(lvButton3, "Level 3")) {
		if (PlayerPrefs.HasKey("Level2")) {
			Debug.Log("Level2 key found");
			Time.timeScale = 1;
			Application.LoadLevel(lvName3);
		}
		else {
			Debug.Log("Level2 key not found");
			lockedLevelClicked = true;
		}
	}
	
	if (newButton(lvResetButton, "Reset Story Mode")) {
		PlayerPrefs.DeleteKey("Level1");
		PlayerPrefs.DeleteKey("Level2");
		PlayerPrefs.DeleteKey("Level3");
	}

	// Return to main menu.
	if (newButton(returnButton, "Return to Main")) {
		Application.LoadLevel(mainMenuName);
	}

	GUI.skin = null;
	GUI.skin.label.fontSize = 16;
	
	// Notice which appears when player clicks a locked level
	if (lockedLevelClicked) {
		GUI.Label(Rect(50,Screen.height-100,400,100), "You must complete previous levels to unlock that level");
	}

}

function newButton(y : float, text : String) : boolean {
	var buttonRect : Rect = new Rect((0.5 - (buttonWidth/2))*Screen.width,
			y*Screen.height, 
			buttonWidth*Screen.width,
			buttonHeight*Screen.width);
	return GUI.Button(buttonRect, GUIContent(text));
}
