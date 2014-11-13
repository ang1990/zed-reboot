#pragma strict

private var initFontSize : float;
private var initFontA : float;
private var scale : float;

function Start () {
	gameObject.guiText.alignment = TextAlignment.Center;
	gameObject.guiText.anchor = TextAnchor.MiddleCenter;
	gameObject.guiText.pixelOffset.x = Screen.width/2;
	gameObject.guiText.pixelOffset.y = Screen.height/2;
	gameObject.guiText.enabled = false;
	initFontSize = 100;
	initFontA = 1;
	Debug.Log(initFontA.ToString());
	scale = gameObject.guiText.fontSize/10;
}


function waveStart (wave : int) {
	gameObject.guiText.text = "Wave "+wave.ToString();
	gameObject.guiText.enabled = true;
	
	gameObject.guiText.fontSize *= 3;
	var i : int;
	for (i=0; i < 20; i++) {
		gameObject.guiText.fontSize -= scale;
		yield WaitForSeconds(0.02);
	}
	
	yield WaitForSeconds(0.5);
	
	while (gameObject.guiText.color.a != 0) {
		gameObject.guiText.color.a -= 0.1;
		yield WaitForSeconds(0.10);
	}
	gameObject.guiText.enabled = false;
	
	gameObject.guiText.fontSize = initFontSize;
	gameObject.guiText.color.a = initFontA;
	
	gameObject.guiText.text = "Survive!";
	gameObject.guiText.enabled = true;
	
	gameObject.guiText.fontSize *= 3;

	for (i=0; i < 20; i++) {
		gameObject.guiText.fontSize -= scale;
		yield WaitForSeconds(0.02);
	}
	
	yield WaitForSeconds(0.5);
	
	while (gameObject.guiText.color.a != 0) {
		gameObject.guiText.color.a -= 0.1;
		yield WaitForSeconds(0.10);
	}
	
	gameObject.guiText.enabled = false;
	
	gameObject.guiText.fontSize = initFontSize;
	gameObject.guiText.color.a = initFontA;
}

function waveEnd (wave : int) {
	gameObject.guiText.text = "Wave "+wave.ToString()+" Cleared";
	gameObject.guiText.enabled = true;
	
	gameObject.guiText.fontSize *= 3;
	var i : int;
	for (i=0; i < 20; i++) {
		gameObject.guiText.fontSize -= scale;
		yield WaitForSeconds(0.02);
	}
	
	yield WaitForSeconds(0.5);
	
	while (gameObject.guiText.color.a != 0) {
		gameObject.guiText.color.a -= 0.1;
		yield WaitForSeconds(0.10);
	}
	gameObject.guiText.enabled = false;
	
	gameObject.guiText.fontSize = initFontSize;
	gameObject.guiText.color.a = initFontA;
}

function initWaveOverlay () {
	gameObject.guiText.fontSize = initFontSize;
	gameObject.guiText.color.a = initFontA;
}
