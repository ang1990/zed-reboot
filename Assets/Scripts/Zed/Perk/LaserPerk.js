﻿#pragma strict

class LaserPerk extends Perk {
	private var active : boolean = true;
	private var color : Color;

	function LaserPerk(name: String,
		skillPointCost : int,
		perkIcon : Texture2D,
		color : Color) {

		super(name, skillPointCost, perkIcon);
		this.color = color;
	}

	function toggleActive() {
		active = !active;
	}

	function isActive() {
		return active;
	}

	function getColor() {
		return color;
	}

	class Builder {
		private var _name : String;
		private var _skillPointCost : int = 0;
		private var _perkIcon : Texture2D;
		private var _color : Color = Color.red;

		function name(val : String) : Builder {
			this._name = val;
			return this;
		}
		
		function skillPointCost(val : int) : Builder {
			this._skillPointCost = val;
			return this;
		}
		
		function perkIcon(val : Texture2D) : Builder {
			this._perkIcon = val;
			return this;
		}

		function color(val : Color) : Builder {
			this._color = val;
			return this;
		}

		function build() : LaserPerk {
			return new LaserPerk(_name, _skillPointCost, _perkIcon,
				_color);
		}
	}
}