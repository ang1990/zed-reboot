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
	scale = initFontSize/10;
}

function levelUp() {
	gameObject.guiText.fontSize = initFontSize;
	gameObject.guiText.color.a = initFontA;
	gameObject.guiText.text = "Level up!";
	gameObject.guiText.enabled = true;
	
	gameObject.guiText.fontSize *= 3;
	var i : int;
	for (i=0; i < 20; i++) {
		gameObject.guiText.fontSize -= scale;
		yield WaitForSeconds(0.01);
	}
	yield WaitForSeconds(0.15);
	while (gameObject.guiText.color.a != 0) {
		gameObject.guiText.color.a -= 0.1;
		yield WaitForSeconds(0.03);
	}
	
	gameObject.guiText.enabled = false;
	
	gameObject.guiText.fontSize = initFontSize;
	gameObject.guiText.color.a = initFontA;
}