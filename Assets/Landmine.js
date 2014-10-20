#pragma strict

var prefab : GameObject;

function OnCollisionEnter2D(coll : Collision2D) {
	if (coll.gameObject.tag == "zed"){
		Instantiate(prefab, transform.position, Quaternion.identity);
		Destroy (gameObject);
	}
}
