#pragma strict

var animator : Animator;

function Start () {
	animator.SetBool("on", true);
}

function Update () {
	if(randomGenerate() < 6) {
		if (animator.GetBool("flicker"))
			animator.SetBool("flicker",false);
		else
			animator.SetBool("flicker",true);
	}
	
	if(randomGenerate() < 8) {
		if (animator.GetBool("on"))
			animator.SetBool("on",false);
		else
			animator.SetBool("on",true);
	}
}

function randomGenerate () {
	return Random.Range(1,10);
}