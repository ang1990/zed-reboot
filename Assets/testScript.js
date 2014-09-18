#pragma strict

function Awake() {}

function Update () {
	if(Input.GetKeyDown("y")) {
		GUI.enabled = false;
	}
}
