#pragma strict

/*
*  Laser sight for zed. Activated by activating the Laser Perk for zed.
*/

var zedResources : ZedResources;
var lineRenderer : LineRenderer;
var zedMovement : ZedMovement;
var sourceOffset : Vector2;
private var sourcePosition : Vector3;

function Start() {
	lineRenderer = GetComponent(LineRenderer);
}

function Update () {
	var laserPerk : LaserPerk = zedResources.activePerks.getLaserPerk();
	if (Input.GetKeyDown("l")) {
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

		var hits : RaycastHit2D[] = Physics2D.RaycastAll(
			sourcePosition, 
			laserSightDirection,
			(mouseWorldPosition - transform.position).magnitude);
		if (hits.Length != 0) {
			lineRenderer.SetPosition(0, sourcePosition);
			lineRenderer.SetPosition(1, hits[0].point);
		} else {
			lineRenderer.SetPosition(0, sourcePosition);
			lineRenderer.SetPosition(1, mouseWorldPosition);
		}
	} else {
		lineRenderer.enabled = false;
	}
}