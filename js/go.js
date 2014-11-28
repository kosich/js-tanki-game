//
// game objects
// inits all additional tools, needed for the game
//

'use strict';
var game = game || {};

//position begin
(function() {
	var position = function(a, b) {
		if (a && a.constructor === game.position && b == undefined) {
			this.x = 0;
			this.y = 0;
			this.set(a);
		} else {
			this.x = a || 0;
			this.y = b || 0;
		}
	};
	var pp = position.prototype;
	pp.magnitude = function() {
		return Math.abs(this.x) + Math.abs(this.y);
	};
	pp.equals = function(other) {
		if (this === other)
			return true;

		return this.x === other.x && this.y === other.y;
	};
	pp.reset = function() {
		this.x = 0;
		this.y = 0;
	};
	pp.set = function(a, b) {
		if (a && a.constructor === game.position && b == undefined) {
			this.x = a.x;
			this.y = a.y;
		} else {
			this.x = a || this.x;
			this.y = b || this.y;
		}
	}
	pp.plus = function(dx) {
		if (dx && dx.constructor === game.position) {
			this.x += dx.x || 0;
			this.y += dx.y || 0;

			return this;
		}
	}
	pp.minus = function(dx) {
		if (dx && dx.constructor === game.position) {
			this.x -= dx.x || 0;
			this.y -= dx.y || 0;

			return this;
		}
	};
	pp.multiply = function(k) {
		if (k && !isNaN(k)) {
			this.x *= k;
			this.y *= k;
		}
	};
	pp.toString = function() {
		return '{ x:' + this.x + ', y:' + this.y + ' }';
	};

	game.position = position;

})();
//position end

//Game object base
(function() {
	game.base = function() {

	};
	game.base.prototype.position = function(a, b) {
		this.p = this.p || new game.position();
		this.p.set(a, b);
	};
	game.base.prototype.dimensions = function(w, h) {
		this.w = w || 1;
		this.h = h || 1;
	};
})();

//TODO: make turrels (for shopping/tunning)
//bullet begin
(function() {
	var bulletinit = function(p, t, speed) {
		(this.p = new game.position()).set(p);
		(this.t = new game.position()).set(t);
		this.dimensions(2, 2);
		this.speed = speed;
	};
	var proto = {
		frame : function(delta) {

			this.p.x += this.t.x * this.speed * delta / 100;
			this.p.y += this.t.y * this.speed * delta / 100;

			for (var i = 0; i < game.map.RO.length; i++) {
				var ro = game.map.RO[i];
				if (game.checkCollision(this, ro)) {
					ro.health(0);

					for (var j = 0; j < game.GO.length; j++) {
						if (this === game.GO[j]) {
							game.GO.splice(j, 1);
							break;
						}
					}
					game.addGO(new game.explosion(new game.position(this.p), 5 + Math.random() * 5));
					break;
				}
			}

			if (game.debug)
				console.log(this.p);
		},
		draw : function(cc, pos) {
			cc.fillStyle = '#000';
			cc.fillRect((pos || this.p).x, (pos || this.p).y, this.w, this.h);

			if (game.debug)
				console.log('drawing bullet');
		}
	}
	game.bullet = inherit(new game.base, proto, bulletinit);
})();
//bullet end

//explosiong begin
(function() {
	var explosioninit = function(position, power) {
		this.position(position);
		this.power = power;
		this.radius = 0;
	};

	//TODO:switch to GO_Base
	var proto = {
		frame : function(delta) {
			this.radius += this.power * delta / 1000;

			var _temp = new game.base;
			_temp.position(this.p.x - this.radius, this.p.y - this.radius);
			_temp.dimensions(this.radius * 2, this.radius * 2);

			var collisionedObjects = [];
			for (var i = 0, j = game.map.RO.length; i < j; i++) {
				try {
					if (game.checkCollision(_temp, game.map.RO[i]))
						collisionedObjects.push(game.map.RO[i]);
				} catch(e) {
					console.log(e);
					console.log(_temp, game.map.RO[i]);
					throw 'checkCollision failed';
				}
			};
			for (var i = 0, j = collisionedObjects.length; i < j; i++) {
				collisionedObjects[i].health(0);
			};

			if (this.radius > 20)
				for (var j = 0; j < game.GO.length; j++) {
					if (this === game.GO[j]) {
						game.GO.splice(j, 1);
						break;
					}
				}
		},
		draw : function(cc, pos) {
			var p = pos || this.p;
			cc.beginPath();

			cc.arc(p.x, p.y, this.radius, 0, 2 * Math.PI, false);
			cc.fillStyle = '#FF2';
			cc.fill();
			cc.closePath();
		}
	}

	game.explosion = inherit(new game.base, proto, explosioninit);
})()
//explosion end

