/*
 * General interface for any type of weapon. Helps with weapon management in e.g. WeaponArsenal of environment.
 */

#pragma strict

class Weapon extends UnityEngine.Object {
	var id : String;
	var weaponType : String;
	var owner : GameObject;

	function checkState() {}

	function switchOut() {}
	function switchIn() {}

	function strike() : boolean {
		Debug.Log("General weapon strike");
		return true;
	}
	
	// Unused.
	
	function secondaryStrike() {}
	
	function getClipSize() : int {
		return 0; // null is melee
	}
	
	function getId() : String {
		return id;
	}
	
	function finishReload() {}
	
	function manualReload() {}
	
	function addClips(clips : int) {}
	
	function playSwitchSound() {}
	
	function getBullets() : int {
		return 0;
	}

	function getReloadSound() {
		return null;
	}
	
	function getBulletsInClip() : int {
		return 0;
	}
	
	function getReloadEndTime() : float {
		return 0;
	}
	
	function isTurretPlacer() : boolean {
		return false;
	}
	
}