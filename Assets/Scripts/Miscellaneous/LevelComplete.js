/*
 * Prompt that appears after completing a QualityLevel.
 * Returns the player to level menu after clicking the button.
 */

#pragma strict

var zedFont : Font;
var flavourTextFontSize : int;
var inputFontSize : int;
var maxInputLength : int;
var buttonFontSize : int;

var boxWidth : float;  // fraction of Screen.width
var boxHeight : float; // fraction of Screen.width
var textFieldHeight : float;
var buttonHeight : float;
var screenYFraction : float;
var zedResources : ZedResources;
var zedStrike : ZedStrike;
var zedMovement : ZedMovement;

var defaultScreenWidth : int = 1400; // for font size calculation
private var screenToDefaultScreenRatio : float; // for scaling across different resolutions

private var promptOpen : boolean = false;

private var centeredStyle : GUIStyle;

function Awake() {
	screenToDefaultScreenRatio = parseFloat(Screen.width)/defaultScreenWidth;
}

function OnGUI() {
	GUI.skin = null;

	if (promptOpen) {
		// Create general box
		changeFontSize(flavourTextFontSize, GUI.skin.box);
		changeFontSize(inputFontSize, GUI.skin.textField);
		changeFontSize(buttonFontSize, GUI.skin.button);

		GUI.Box(
			Rect((0.5 - (boxWidth/2))*Screen.width,
			screenYFraction*Screen.height,
			boxWidth*Screen.width,
			boxHeight*Screen.height), 
			"Congratulations,\nyou have cleared\nthis area.");

		

		GUILayout.BeginArea(
			Rect((0.5 - (boxWidth/2))*Screen.width,
			screenYFraction*Screen.height + boxHeight*Screen.height + 4,
			boxWidth*Screen.width,
			buttonHeight));
		if (GUILayout.Button("Back to Level Select", GUILayout.Width(boxWidth*Screen.width), GUILayout.Height(buttonHeight))) {
			var path : String [] = Application.loadedLevelName.Split(char.Parse("/"));
			var scenename : String [] = path[path.Length -1].Split(char.Parse("."));
			PlayerPrefs.SetString(scenename[0], "Level Clear");
			Debug.Log(scenename[0] + " clear saved into playerprefs");
			levelSelectButtonPressed();
		}
		GUILayout.EndArea();

		// As the prompt opens, focus is automatically put on the textbox.
		if (GUI.GetNameOfFocusedControl() == String.Empty) {
		    GUI.FocusControl("inputField");
		}
	}

	GUI.skin = null;
}

function openPrompt() {
	promptOpen = true;
}

function closePrompt() {
	promptOpen = false;
	Application.LoadLevel("LevelMenu");
}

function changeFontSize(newsize : int, element : GUIStyle) {
	element.fontSize = newsize*screenToDefaultScreenRatio;
	centeredStyle = GUIStyle(element);
    centeredStyle.alignment = TextAnchor.MiddleCenter;
}

function levelSelectButtonPressed() {
	closePrompt();
}