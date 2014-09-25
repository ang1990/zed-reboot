#pragma strict
import System.Collections.Generic;


class PerkList {
	private var list : List.<Perk>;
	private var movementPerkList : List.<MovementPerk>;
	private var weaponPerkList : List.<WeaponPerk>;
	private var laserPerk : LaserPerk;
	
	private var lastAdded : Perk;
	
	function PerkList() {
		list = new List.<Perk>();
		movementPerkList = new List.<MovementPerk>();
		weaponPerkList = new List.<WeaponPerk>();
	}
	
	function addPerk(perk : Perk) {
		list.Add(perk);
		if (perk instanceof MovementPerk) {
			movementPerkList.Add(perk as MovementPerk);
		} else if (perk instanceof WeaponPerk) {
			weaponPerkList.Add(perk as WeaponPerk);
		} else if (perk instanceof LaserPerk) {
			laserPerk = perk as LaserPerk;
		}
		lastAdded = perk;
	}
	
	function getLastAdded() : Perk {
		return lastAdded;
	}
	
	function getPerks() : List.<Perk> {
		return list;	
	}
	
	function getMovementPerks() : List.<MovementPerk> {
		return movementPerkList;	
	}
	
	function getWeaponPerks() : List.<WeaponPerk> {
		return weaponPerkList;
	}

	function getLaserPerk() : LaserPerk {
		return laserPerk;
	}


}