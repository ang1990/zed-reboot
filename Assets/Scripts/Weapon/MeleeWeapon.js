/*
 * The mechanics behind a sword strike using a raycast from the base to the tip of the sword at every animation frame.
 * The sword deals damage on time as long as the sword is inside an enemy.
 */

#pragma strict

class MeleeWeapon extends Weapon {
	private var weaponAnimator : Animator;
	var power : int;
	
	private var zedTransform : Transform;
	private var zedMovement : ZedMovement;
	
	private var strikeStartTime : float;
	private var strikeEndTime : float;
	
	private var angleData : float[]; // 3xn array: 
									 // first column: time
									 // second column: angle
									 // third column: length
	private var angleDataPointCount : int;
	
	private var slashSound : AudioClip;
	private var unsheathSound : AudioClip;
	
	function MeleeWeapon(
			power : int,
			id : String,
			owner : GameObject,
			slashSound : AudioClip,
			unsheathSound : AudioClip) {

		this.power = power;
		this.id = id;
		this.owner = owner;	
		this.slashSound = slashSound;
		this.unsheathSound = unsheathSound;
		
		zedTransform = owner.transform;
		this.weaponType = "meleeWeapon";
	}

	// @Override
	function strike() : boolean {
//		AudioSource.PlayClipAtPoint(slashSound,zed.transform.position);
		strikeStartTime = Time.timeSinceLevelLoad;
		strikeEndTime = Time.timeSinceLevelLoad + angleData[3*(angleDataPointCount-1)];
		return true;
	}

	// @Override
	function getClipSize() : int {
		return 0; // 0 is melee
	}
	
	function initAngleData(data : float[]) {
		angleData = data;
		if ((angleData.Length % 3) != 0) {
			Debug.Log("Error in Sword.initAngleData: numer of array entries must be multiple of 3!");
		}
		angleDataPointCount = angleData.Length/3;
	}
	
	// Reload sound is replaced by unsheathing sound.
	function getReloadSound() {
		return unsheathSound;
	}
	
	function playSwitchSound() {
		AudioSource.PlayClipAtPoint(getReloadSound() as AudioClip, owner.transform.position);
	}
	
	function isStriking() {
		return (Time.timeSinceLevelLoad < strikeEndTime);
	}
	
	function executeStrike() {
		if (!isStriking()) {
			return;
		}	
		
		var bodyAngle : float;
		bodyAngle = owner.transform.eulerAngles.z;
		
		var currentStrikeTime = Time.timeSinceLevelLoad - strikeStartTime;
		
		// find current length and angle
		if (angleData == null) {
			Debug.Log("error in Sword.executeStirke(): no sword angle data found!"); 
			return;
		}
		var angleDataIndex : int = 0;
		var differenceAfter : float;
		var frameTime : float;
		var currentAngle : float;
		var currentLength : float ;
		for (var i : int = 0; i < angleDataPointCount; i++) {
			if (currentStrikeTime > angleData[3*i]) {
				angleDataIndex = i;
			} else break;
		}
		if (angleDataIndex < angleDataPointCount - 1) {
			differenceAfter = currentStrikeTime - angleData[3*angleDataIndex];
			frameTime = angleData[3*(angleDataIndex + 1)] - angleData[3*angleDataIndex];
			var weight : float = differenceAfter/frameTime;
			currentAngle = bodyAngle 
					+ (1 - weight)*angleData[3*angleDataIndex + 1]
					+ (weight)*angleData[3*angleDataIndex + 4];
			currentLength = (1 - weight)*angleData[3*angleDataIndex + 2]
					+ (weight)*angleData[3*angleDataIndex + 5];
		} else {
			currentAngle = bodyAngle + angleData[3*angleDataIndex + 1];
			currentLength = angleData[3*angleDataIndex + 2];
		}
	
		var currentDirection : Vector2 = new Vector2(Mathf.Cos(Mathf.Deg2Rad*currentAngle),
				Mathf.Sin(Mathf.Deg2Rad*currentAngle));
			
		Debug.DrawLine(zedTransform.position, zedTransform.position + currentDirection*currentLength, Color.cyan);	
		var hit : RaycastHit2D[] = Physics2D.RaycastAll(zedTransform.position, currentDirection, currentLength);

	
		for (var h : RaycastHit2D in hit) {
			// distinguish cases wether zombies are hitting zed or vice versa
			if (owner.CompareTag("zed")) {
				if (h.transform.gameObject.CompareTag("zombie")) {
					h.transform.gameObject.GetComponent(ZombieImpact).swordImpact(power);
				}
			} else if (owner.CompareTag("zombie")) {
				if (h.transform.gameObject.CompareTag("zed")) {
					h.transform.gameObject.GetComponent(ZedResources).swordImpact(power);
				}
			}
		}			
	} 
}