#pragma strict

var testVelocity : Vector2;

var parentTransform : Transform;
var pushInfluence : float = 1;
var pushedWeight : float = 1;
var pushPerpendicular : boolean;

private var _transform : Transform;

private var insideCounter : int;

private var colliderRadius : float;

function Awake() {
	_transform = transform;
	
	var collider : Collider2D = GetComponent(Collider2D);
	if (collider == null) {
		Debug.Log("Error: " + transform.root.gameObject.name + " has a collision detector object which does not have a collider");
	}
	
	if (collider instanceof CircleCollider2D) {
		var circleCollider : CircleCollider2D = collider as CircleCollider2D;
		colliderRadius =  Mathf.Min(parentTransform.localScale.x, parentTransform.localScale.y)*
				circleCollider.radius;
	} else if (collider instanceof BoxCollider2D) {
		var boxCollider : BoxCollider2D = collider as BoxCollider2D;
		colliderRadius = Mathf.Min(boxCollider.size.x, boxCollider.size.y)*
				Mathf.Min(parentTransform.localScale.x, parentTransform.localScale.y);
	} else {
		Debug.Log("Error: CollisionBehavior only supports circle and box colliders");
	}
	
}


function Update() {					
	parentTransform.position += Time.deltaTime*testVelocity;	
}


function OnTriggerStay2D(other : Collider2D) {

	if (other.gameObject.CompareTag("collisionDetector")) {		
		insideCounter++;
		var otherCollisionBehavior = other.GetComponent(CollisionBehavior);
		
		if (otherCollisionBehavior == null) {
			Debug.LogError(other.transform.root.name + " has physics collider child without CollisionBehavior-Script attached!");
			return;
		}
		var positionDifference : Vector3 = otherCollisionBehavior.getPosition() - _transform.position;
		positionDifference.z = 0;	
		
		var absPositionDifference : float;
		var pushImpulse : Vector2;
		var displacementDirection : Vector3;
		var adjustedPushInfluence : float;
		var overlapDistance : float;
		
		if (!pushPerpendicular) {		
			absPositionDifference = positionDifference.magnitude;		
			if (absPositionDifference == 0) {
				// in the unlikely case that both objects are exactly on top of each other
				// an arbitrary direction is chosen			
				positionDifference = new Vector3(Random.Range(-1,1), Random.Range(-1,1), 0);
			}
			overlapDistance = colliderRadius + otherCollisionBehavior.getColliderRadius() - absPositionDifference;
			adjustedPushInfluence = pushInfluence / (pushInfluence + otherCollisionBehavior.pushInfluence);
			displacementDirection = positionDifference.normalized;
			pushImpulse = adjustedPushInfluence*overlapDistance*(new Vector2(displacementDirection.x, displacementDirection.y));
		} else {
			var pushDirection : Vector2 = new Vector2(parentTransform.up.x, parentTransform.up.y);
			displacementDirection = positionDifference.normalized;
			absPositionDifference = Mathf.Abs(Vector2.Dot(displacementDirection, pushDirection));
			var directionSign : float = Mathf.Sign(Vector2.Dot(displacementDirection, pushDirection));
			overlapDistance = colliderRadius + otherCollisionBehavior.getColliderRadius() - absPositionDifference;
			adjustedPushInfluence = pushInfluence / (pushInfluence + otherCollisionBehavior.pushInfluence);
			pushImpulse = directionSign*adjustedPushInfluence*overlapDistance*pushDirection;
//			Debug.Log(transform.root.gameObject.name);
		}
		otherCollisionBehavior.displaceTransform(pushImpulse);	
		
	}
}

function displaceTransform(impulse : Vector2) {
	parentTransform.position.x += pushedWeight*impulse.x;	
	parentTransform.position.y += pushedWeight*impulse.y;
}

function getColliderRadius() : float {
	return colliderRadius;
}

function getPosition() : Vector3 {
	return _transform.position;
}