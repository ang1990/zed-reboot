#pragma strict

/*
*  Laser sight for zed. Activated by activating the Laser Perk for zed.
*/

var zedResources : ZedResources;
var lineRenderer : LineRenderer;
var zedMovement : ZedMovement;
var sourceOffset : Vector2;
private var sourcePosition : Vector3;

var collideTags : String[] = ["tallTerrain", "zombie"];

function Start() {
	lineRenderer = GetComponent(LineRenderer);
}

function Update () {
	var laserPerk : LaserPerk = zedResources.activePerks.getLaserPerk();
	if (Input.GetKeyDown("l") && laserPerk != null) {
		laserPerk.toggleActive();
	}
	if (laserPerk != null && laserPerk.isActive() && zedResources.currentWeaponIndex != 0) {
		lineRenderer.enabled = true;
		var color : Color = laserPerk.getColor();
		lineRenderer.SetColors(color, color);

		var angle : float = zedMovement.getUpperBodyAngle();
		sourcePosition = zedMovement.getPosition() + ZedUtils.rotateVector(sourceOffset, angle);

		var laserSightDirection : Vector2 = new Vector2(
				Mathf.Cos(Mathf.Deg2Rad*angle),
				Mathf.Sin(Mathf.Deg2Rad*angle));

		var mouseScreenPosition : Vector3 = Input.mousePosition;
		mouseScreenPosition.z = sourcePosition.z - Camera.main.transform.position.z;
		var mouseWorldPosition : Vector3 = Camera.main.ScreenToWorldPoint(mouseScreenPosition);

		var hits : RaycastHit2D[] = Physics2D.RaycastAll(sourcePosition, laserSightDirection,
			(mouseWorldPosition - transform.position).magnitude);
		
		if (hits.Length > 0)  {
			var hitIndex : int = 0;
			for (hit in hits) {
				if(stopsLaser(hit.collider.gameObject))
					break;
				else
					hitIndex++;
			}
			if (hitIndex < hits.Length) {
				lineRenderer.SetPosition(0, sourcePosition);
				lineRenderer.SetPosition(1, hits[hitIndex].point);
			} else {
			lineRenderer.SetPosition(0, sourcePosition);
			lineRenderer.SetPosition(1, mouseWorldPosition);
			}
		} else {
			lineRenderer.SetPosition(0, sourcePosition);
			lineRenderer.SetPosition(1, mouseWorldPosition);
		}
	} else {
		lineRenderer.enabled = false;
	}
}

private function stopsLaser(o : GameObject) : boolean {
	for (tag in collideTags) {
		if (o.CompareTag(tag)) {
			return true;
		}
	}
	return false;
}
