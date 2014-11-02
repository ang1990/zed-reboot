#pragma strict

var zedFont : Font;
var buttonFontSizeMultiplier : float;
var defaultFontSize : float = 16; // for font size calculation

var defaultScreenWidth : int = 1600; // for font size calculation

var next : Texture2D;
var nextStyle : GUIStyle;

private var screenToDefaultScreenRatio : float; // for scaling across different resolutions

var sprite0 : Sprite;
var sprite1 : Sprite;
var sprite2 : Sprite;
var sprite3 : Sprite;
var sprite4 : Sprite;
var sprite5 : Sprite;
var sprite6 : Sprite;
var sprite7 : Sprite;
var sprite8 : Sprite;
var sprite9 : Sprite;
var sprite10 : Sprite;
var sprite11 : Sprite;

var index = 0;

private var allImages : Sprite[] = new Sprite[12];

private var sr : SpriteRenderer;

function Awake() {
	screenToDefaultScreenRatio = parseFloat(Screen.width)/defaultScreenWidth;
}

function Start() {
	sr = GameObject.FindGameObjectWithTag("csImage").GetComponent(SpriteRenderer);
	allImages[0]=sprite0;
	allImages[1]=sprite1;
	allImages[2]=sprite2;
	allImages[3]=sprite3;
	allImages[4]=sprite4;
	allImages[5]=sprite5;
	allImages[6]=sprite6;
	allImages[7]=sprite7;
	allImages[8]=sprite8;
	allImages[9]=sprite9;
	allImages[10]=sprite10;
	allImages[11]=sprite11;
}

function OnGUI() {

	GUI.skin = null;
	GUI.skin.font = zedFont;
	GUI.skin.button.fontSize = defaultFontSize*buttonFontSizeMultiplier*screenToDefaultScreenRatio;
	
	if (newButton()) {
		Time.timeScale = 1;
		changeImage();
	}
}

function newButton() : boolean {
	var buttonRect : Rect = new Rect(0.8*Screen.width,
			0.85*Screen.height, 
			50,
			50);
	return GUI.Button(buttonRect, "", nextStyle);
}

function changeImage() {
	index = index+1;
	if (index<allImages.Length) {
		sr.sprite = allImages[index];
	}
	else
		Application.LoadLevel("Level1");
}












