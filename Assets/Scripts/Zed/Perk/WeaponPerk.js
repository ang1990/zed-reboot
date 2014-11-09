#pragma strict

/*
*  Weapon Perk class to influence weapon properties.
*/

class WeaponPerk extends Perk {
	private var rateOfFireMultiplier : float;
	private var firepowerMultiplier : float;
	private var scatterMultiplier : float;
	
	function WeaponPerk(name : String,
			skillPointCost : int, 
			perkIcon : Texture2D,
			rateOfFireMultiplier : float,
			firepowerMultiplier : float,
			scatterMultiplier : float){
		
		super(name, skillPointCost, perkIcon);
		this.rateOfFireMultiplier = rateOfFireMultiplier;
		this.firepowerMultiplier = firepowerMultiplier;
		this.scatterMultiplier = scatterMultiplier;
	}
	
	function getRateOfFireMultiplier() : float {
		return rateOfFireMultiplier;
	}
	
	function getFirepowerMultiplier() : float {
		return firepowerMultiplier;
	}	
	
	function getScatterMultiplier() : float {
		return scatterMultiplier;
	}
	
	class Builder {
		private var _name : String;
		private var _skillPointCost : int = 0;
		private var _perkIcon : Texture2D;
		private var _rateOfFireMultiplier : float = 1;
		private var _firepowerMultiplier : float = 1;		
		private var _scatterMultiplier : float = 1;

		function name(val : String) : Builder {
			this._name = val;
			return this;
		}
		
		function skillPointCost(val : int) : Builder {
			this._skillPointCost = val;
			return this;
		}
		
		function perkIcon(val : Texture2D) {
			this._perkIcon = val;
			return this;
		}
		
		function rateOfFireMultiplier(val : float) : Builder {
			this._rateOfFireMultiplier = val;
			return this;
		}
		
		function firepowerMultiplier(val : float) : Builder {
			this._firepowerMultiplier = val;
			return this;
		}
		
		function scatterMultiplier(val : float) : Builder {
			this._scatterMultiplier = val;
			return this;
		}
		
		function build() : WeaponPerk {
			return new WeaponPerk(_name, _skillPointCost, _perkIcon, 
					_rateOfFireMultiplier, _firepowerMultiplier,
					_scatterMultiplier);
		}
	}
}