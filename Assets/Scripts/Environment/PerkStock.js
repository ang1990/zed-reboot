#pragma strict
/*
 * Defines all categories and perks that can be purchased in the game
 */

import System.Collections.Generic;

final var CATEGORY_COUNT : int = 5;
final var MOVEMENT : int = 0;
final var RATE_OF_FIRE : int = 1;
final var FIRE_POWER : int = 2;
final var SHOT_ACCURACY : int = 3;
final var MISC : int = 4;

private var perkTree : List.<Perk>[]; // array of Lists
private var unlockLevel : int[]; 	// to what level perks in each 
									// category are unlocked

var movementPerkTextureA : Texture2D;
var movementPerkTextureB : Texture2D;

function Start() {
	createPerkStock();
	unlockFirstLevel();		
}

function createPerkStock() {
	perkTree = new List.<Perk>[CATEGORY_COUNT];
	unlockLevel = new int[CATEGORY_COUNT];
	
	for (var i : int = 0; i < CATEGORY_COUNT; i++) {
		perkTree[i] = new List.<Perk>();
	}
	
	perkTree[MOVEMENT].Add(
			new MovementPerk.Builder()
					.name("Speed")
					.skillPointCost(1)
					.speedMultiplier(1.2)
					.accelerationMultiplier(1.1)
					.build());
					
	perkTree[MOVEMENT].Add(
			new MovementPerk.Builder()
					.name("More\nSpeed")
					.skillPointCost(2)
					.speedMultiplier(1.25)
					.accelerationMultiplier(1.2)
					.build());
					
	perkTree[MOVEMENT].Add(
			new MovementPerk.Builder()
					.name("Epic\nSpeed")
					.skillPointCost(2)
					.speedMultiplier(1.2)
					.accelerationMultiplier(1.2)
					.build());
				
	perkTree[RATE_OF_FIRE].Add(
			new WeaponPerk.Builder()
					.name("Fire Rate\nUpgrade")
					.skillPointCost(1)
					.rateOfFireMultiplier(1.2)
					.build());
					
	perkTree[RATE_OF_FIRE].Add(
			new WeaponPerk.Builder()
					.name("Speedy\nGunzales")
					.skillPointCost(2)
					.rateOfFireMultiplier(1.4)
					.build());
					
	perkTree[FIRE_POWER].Add(
			new WeaponPerk.Builder()
					.name("Hollow\nPoints")
					.skillPointCost(2)
					.firepowerMultiplier(1.25)
					.build());	
					
	perkTree[FIRE_POWER].Add(
			new WeaponPerk.Builder()
					.name("Depleted\nUranium")
					.skillPointCost(2)
					.firepowerMultiplier(1.2)
					.build());	
					
	perkTree[FIRE_POWER].Add(
			new WeaponPerk.Builder()
					.name("Shredder\nAmmo")
					.skillPointCost(4)
					.firepowerMultiplier(1.5)
					.build());		
	
	perkTree[SHOT_ACCURACY].Add(
			new WeaponPerk.Builder()
					.name("Improved\nRecoil")
					.skillPointCost(1)
					.scatterMultiplier(0.6)
					.build());
					
	perkTree[SHOT_ACCURACY].Add(
			new WeaponPerk.Builder()
					.name("Crack\nShot")
					.skillPointCost(2)
					.scatterMultiplier(0.0)
					.build());

	perkTree[MISC].Add(
			new LaserPerk.Builder()
					.name("Laser Sight\n")
					.skillPointCost(1)
					.color(Color(0, 1, 0))
					.build());

}

function getPerk(category : int, index : int) {
	return perkTree[category][index];
}

function getCategorySize(category : int) {
	return perkTree[category].Count;
}

function unlockFirstLevel() {
	for (var i : int = 0; i < CATEGORY_COUNT; i++) {
		unlockLevel[i] = 0;
	}
}

function isUnlocked(categoryIndex : int, perkIndex : int) : boolean {
	return (unlockLevel[categoryIndex] >= perkIndex);
}

function isActive(categoryIndex : int, perkIndex : int) : boolean {
	return (unlockLevel[categoryIndex] > perkIndex);
}

function unlock(categoryIndex : int) {
	unlockLevel[categoryIndex]++;
}