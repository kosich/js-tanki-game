//
// tank Ai
//

'use strict';
(function() {
	game.TankAI = function(tank) {
		this.tank = tank;
	};
	var i = 0;
	game.TankAI.prototype.frame = function(delta) {
		if (Math.random() < 0.02) {
			do {
				i = Math.floor(Math.random() * 4);
			} while (i===4);// in case when random returns 1;

			this.tank.turn(directions[i]);

		} else {
			this.tank.move(new game.position(this.tank.t), delta);
		}

		if (Math.random() < 0.005)
			this.tank.shoot_prime();
	};
	var directions = [new game.position(0, -1),	//up
	new game.position(1, 0),	//right
	new game.position(0, 1),	//bottom
	new game.position(-1, 0)	//left
	];
})();
