#pragma strict

/* 
*  Zombie properties class.
*/

var experience : float;
var maxHealth : float;
var attackDamage : float;
var timeBetweenHits : float;
var coinDropProbability : float;
var coinsDroppable : int; // even if 1, might not end up dropping any coins due to probability
var speed : float;

function getExpGained() {
	return experience;
}

function multiplyExpGained(factor : float) {
	experience *= factor;
}

function getAttackDamage() {
	return attackDamage;
}

function getMaxHealth() {
	return maxHealth;
}

function getTimeBetweenHits() {
	return timeBetweenHits;
}

function getCoinDropProbability() {
	return coinDropProbability;
}

function getCoinsDroppable() {
	return coinsDroppable;
}

function getSpeed() {
	return speed;
}