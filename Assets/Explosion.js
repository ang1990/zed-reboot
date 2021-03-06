﻿#pragma strict

var explosionSound : AudioClip;

var damage : float = -1;
var damageDone : boolean = false;

var ownerTag : String;

enum Allegiance {Friendly, Hostile, Neutral, Ambiguous};
var alignment = Allegiance.Neutral;

function Start () {
	AudioSource.PlayClipAtPoint(explosionSound,transform.position);
	TimedObjectDestructor.destroyGameObjectInSeconds(gameObject, 1);
}

function Update() {
	if (!damageDone && damage > 0) {
//		Debug.Log("Explosion processing.");
		processExplosion();
		damageDone = !damageDone;
	}
}

function setAllegiance(tag : String) {
	switch(tag) {
		case "zombie":
			alignment = Allegiance.Hostile;
			break;
		case "bullet":
		case "Landmine":
		case "Player":
			alignment = Allegiance.Friendly;
		default:
			break;
	}
}

function setDamage(dmg : float) {
	this.damage = dmg;
}

function processExplosion() {
	var colliders : Collider2D[] = Physics2D.OverlapCircleAll(transform.position, 1);
//	Debug.Log(alignment);
	for (var c : Collider2D in colliders) {
		switch(alignment) {
			case Allegiance.Friendly:
//				Debug.Log("Damage Done.");
				if (c.gameObject.GetComponent(ZombieImpact) != null) 
					c.gameObject.GetComponent(ZombieImpact).damage(damage);
				break;
			case Allegiance.Hostile:
				if(c.gameObject.GetComponent(ZedResources) != null){
					c.gameObject.GetComponent(ZedResources).reduceHealth(damage);
				}
				else if(c.gameObject.CompareTag("turret"))
					Destroy(c.gameObject);
				break;
			case Allegiance.Neutral:
				break;
			case Allegiance.Ambiguous:
//				Debug.Log(alignment);
				if (c.gameObject.GetComponent(ZombieImpact) != null) 
					c.gameObject.GetComponent(ZombieImpact).damage(damage);
//				Debug.Log("Damage Done.");
				if(c.gameObject.CompareTag("Player"))
					c.gameObject.GetComponent(ZedResources).reduceHealth(damage);
				else if(c.gameObject.CompareTag("turret"))
					Destroy(c.gameObject);
			default:
				break;
		}
	}
}