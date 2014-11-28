/**
 * Tank prototype
 *
 */'use strict';

(function() {

	function tank_image(level) {

		var img = new Image();
		img.src = 'img/tank_' + level + '.png';

		this.draw = function(canvascontext, x, y) {
			canvascontext.drawImage(img, x, y);
		};
	}

	var tankinit = function(spawnpos) {
		// set position
		this.position(spawnpos);
		this.dimensions(25, 15);
		//default looking upwards
		this.t = new game.position(0, -1);
		//turn
		this.image = new tank_image(1);

		//10 px per second
		this.speed = 10;
	}
	var tankproto = {
		shoot_prime : function() {//TODO: get bullet from turrel
			if (game.debug)
				console.log('pewed');
			game.addGO(new game.bullet(this.p, this.t, 6));
		},
		shoot_secondary : function() {//TODO: get bullet from turrel
			if (game.debug)
				console.log('pew-pewed');
			game.addGO(new game.bullet(this.p, this.t, 3));
		},
		move : function(mx, delta) {//pass: left up right down -or- game.position object to modify current position
			if (!mx)
				return;

			if (( typeof mx) === 'string') {//passed direction

				if (game.debug)
					console.log('tank moving ' + mx);

				var _m = new game.position();

				switch(mx) {
					case 'left':
						_m.x = -1;
						break;
					case 'up':
						_m.y = -1;
						break;
					case 'right':
						_m.x = 1;
						break;
					case 'down':
						_m.y = 1;
						break;
				}

				this.move(_m, delta);
			} else {//passed position
				//TODO: produce dust
				if (!mx.equals(this.t)) {
					this.turn(mx);
					if (game.debug)
						console.log('turned to ' + this.p);

				} else {
					//TODO: check for rigid body interrupts
					mx.x = mx.x * this.speed * delta / 1000;
					mx.y = mx.y * this.speed * delta / 1000;

					this.p.plus(mx);

					for (var i = 0; i < game.map.RO.length; i++) {
						if (game.checkCollision(this, game.map.RO[i])) {
							this.p.minus(mx);
							break;
						};
					};

					if (game.debug)
						console.log('moved to ' + this.p);
				}

			}

		},
		turn : function(tx) {
			this.t.set(tx);
		}
	}
	game.Tank = inherit(game.base, tankproto, tankinit);

})();

