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
var levelButtonY : float;
var startButtonY : float; 
var zombieMinesButtonY : float;
var howToPlayButtonY : float;
var highScoreButtonY : float;
var quitButtonY : float;

var levelMenuName : String;
var gameSceneName : String;
var zombieMinesSceneName : String;
var highScoreSceneName : String;
var howToPlaySceneName : String;

function Awake() {
	screenToDefaultScreenRatio = parseFloat(Screen.width)/defaultScreenWidth;
}

function OnGUI() {
	GUI.skin = null;
	GUI.skin.font = zedFont;
	GUI.skin.label.fontSize = defaultFontSize*titleFontSizeMultiplier*screenToDefaultScreenRatio;
	GUI.skin.button.fontSize = defaultFontSize*buttonFontSizeMultiplier*screenToDefaultScreenRatio;

	// Title
	var centeredStyle = GUIStyle(GUI.skin.label);
    centeredStyle.alignment = TextAnchor.UpperCenter;
	var buttonRect : Rect = new Rect((0.5 - (titleWidth/2))*Screen.width,
			titleLabelY*Screen.height, 
			titleWidth*Screen.width,
			titleHeight*Screen.width); // height until first button
	GUI.Label(buttonRect, GUIContent("zed"), centeredStyle);

	if (newButton(levelButtonY, "Stage Mode")) {
		Application.LoadLevel(levelMenuName);
	}

	// Start Survival
	if (newButton(startButtonY, "Start Survival")) {
		Time.timeScale = 1;
		Application.LoadLevel(gameSceneName);
	}
	
	// Start ZombieMines
	if (newButton(zombieMinesButtonY, "Start Zombie Mines")) {
		Time.timeScale = 1;
		Application.LoadLevel(zombieMinesSceneName);
	}
	
	// High scores
	if (newButton(highScoreButtonY, "High Scores")) {
		Application.LoadLevel(highScoreSceneName);
	}

	// How to play
	if (newButton(howToPlayButtonY, "How To Play")) {
		Application.LoadLevel(howToPlaySceneName);
	}

	// Quit game
	if (newButton(quitButtonY, "Quit Game")) {
		Application.Quit();
	}

	GUI.skin = null;
}

function newButton(y : float, text : String) : boolean {
	var buttonRect : Rect = new Rect((0.5 - (buttonWidth/2))*Screen.width,
			y*Screen.height, 
			buttonWidth*Screen.width,
			buttonHeight*Screen.width);
	return GUI.Button(buttonRect, GUIContent(text));
}