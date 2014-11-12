var sword : GUITexture;
var revolver : GUITexture;
var rifle : GUITexture;
var shotgun : GUITexture;
var grenadier : GUITexture;
var zed : GameObject;

private var zedResources : ZedResources;
private var weapon : Weapon;
private var position : Vector2;
private var initAlpha : float;

function Start () {
	zed = GameObject.Find("zed");
	zedResources = zed.GetComponent(ZedResources);
	
	sword.guiTexture.enabled = false;
	revolver.guiTexture.enabled = false;
	rifle.guiTexture.enabled = false;
	shotgun.guiTexture.enabled = false;
	grenadier.guiTexture.enabled = false;
	
	sword.guiText.enabled = false;
	revolver.guiText.enabled = false;
	rifle.guiText.enabled = false;
	shotgun.guiText.enabled = false;
	grenadier.guiText.enabled = false;
	
	weapons = zedResources.weapons;
	position.x = 0.02*Screen.width;
	position.y = 0.98*Screen.height - sword.guiTexture.pixelInset.height;
	initAlpha = sword.guiTexture.color.a;
}

function OnGUI () {
	
	var i : int;
	for (i=0; i<zedResources.weapons.length; i++) {
		weapon = zedResources.weapons[i];
		displayHUDWeapon(weapon.id,position,i);
		position.x +=sword.guiTexture.pixelInset.width;
	}
	
	position.x = 0.02*Screen.width;
	position.y = 0.98*Screen.height - sword.guiTexture.pixelInset.height;
	
	highlightHUDweapon(zedResources.weapons[zedResources.currentWeaponIndex].id);
}

function displayHUDWeapon (id : String, position : Vector2, index : int) {
	index++;
	if (id == "assaultRifle") {
		rifle.guiText.text = index.ToString();
		rifle.guiTexture.pixelInset.x = position.x;
		rifle.guiTexture.pixelInset.y = position.y;
		rifle.guiText.pixelOffset.x = rifle.guiTexture.pixelInset.x+5;
		rifle.guiText.pixelOffset.y = position.y;
		rifle.guiText.enabled=true;
		rifle.guiTexture.enabled=true;
	} else if (id == "shotgun") {
		shotgun.guiText.text = index.ToString();
		shotgun.guiTexture.pixelInset.x = position.x;
		shotgun.guiTexture.pixelInset.y = position.y;
		shotgun.guiText.pixelOffset.x = shotgun.guiTexture.pixelInset.x+5;
		shotgun.guiText.pixelOffset.y = position.y;
		shotgun.guiText.enabled=true;
		shotgun.enabled=true;
	} else if (id == "revolver") {
		revolver.guiText.text = index.ToString();
		revolver.guiTexture.pixelInset.x = position.x;
		revolver.guiTexture.pixelInset.y = position.y;
		revolver.guiText.pixelOffset.x = revolver.guiTexture.pixelInset.x+5;
		revolver.guiText.pixelOffset.y = position.y;
		revolver.guiText.enabled=true;
		revolver.enabled=true;
	} else if (id == "sword") {
		sword.guiText.text = index.ToString();
		sword.guiTexture.pixelInset.x = position.x;
		sword.guiTexture.pixelInset.y = position.y;
		sword.guiText.pixelOffset.x = sword.guiTexture.pixelInset.x+5;
		sword.guiText.pixelOffset.y = position.y;
		sword.guiText.enabled=true;
		sword.enabled=true;
	} else if (id == "grenadier") {
		grenadier.guiText.text = index.ToString();
		grenadier.guiTexture.pixelInset.x = position.x;
		grenadier.guiTexture.pixelInset.y = position.y;
		grenadier.guiText.pixelOffset.x = grenadier.guiTexture.pixelInset.x+5;
		grenadier.guiText.pixelOffset.y = position.y;
		grenadier.guiText.enabled=true;
		grenadier.enabled=true;
	}
}

function highlightHUDweapon(id : String) {
	sword.guiTexture.color.a = initAlpha;
	revolver.guiTexture.color.a = initAlpha;
	rifle.guiTexture.color.a = initAlpha;
	shotgun.guiTexture.color.a = initAlpha;
	grenadier.guiTexture.color.a = initAlpha;
	
	
	if (id == "assaultRifle") {
		rifle.guiTexture.color.a = 3*initAlpha;
	} else if (id == "shotgun") {
		shotgun.guiTexture.color.a = 3*initAlpha;
	} else if (id == "revolver") {
		revolver.guiTexture.color.a = 3*initAlpha;
	} else if (id == "sword") {
		sword.guiTexture.color.a = 3*initAlpha;
	} else if (id == "grenadier") {
		grenadier.guiTexture.color.a = 3*initAlpha;
	}
}




