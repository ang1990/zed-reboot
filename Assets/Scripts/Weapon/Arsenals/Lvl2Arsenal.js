#pragma strict

var arsenal : WeaponArsenal;
var zedResources : ZedResources;

function Start() {
	arsenal = GetComponent(WeaponArsenal) as WeaponArsenal;
	zedResources = GameObject.Find("zed").GetComponent(ZedResources) as ZedResources;
	zedResources.weapons = arsenal.lvl2Arsenal();
}
