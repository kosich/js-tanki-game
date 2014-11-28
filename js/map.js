/* Map prototypes
*
*
* mapobject
*///
'use strict';
(function() {
	game = game || {};

	//pixel side size of minimal object/ i.e. if this val is 2, then minimal object is 2x2 px
	game.Map = {};
	var s = game.Map.size = 8;

	var mapobjectbase = function() {
		this.dimensions(s, s);
	}
	mapobjectbase.prototype = new game.base;
	mapobjectbase.prototype.render = function(cc, x, y) {
		cc.fillStyle = this.color;
		if (x ^ y)
			throw 'x or y wasnt set for the render';

		cc.fillRect(x || this.p.x, y || this.p.y, this.w, this.h);

	};
	mapobjectbase.prototype.health = function(value) {
		if (this.immutable())
			return;
		var v = this._v('health', value);
		if (v === 0) {
			for (var i = 0; i < game.map.RO.length; i++) {
				if (this == game.map.RO[i]) {
					game.map.RO.splice(i, 1);
					break;
				}
			}
			var maplayer = game.map.layers[this.layer()];
			for (var i = 0; i < maplayer.length; i++) {
				if (this == maplayer[i]) {
					maplayer.splice(i, 1);
					break;
				}
			}
		}
		return v;
	};

	mapobjectbase.prototype.rigid = function(value) {
		return this._v('rigid', value);
	};
	mapobjectbase.prototype.immutable = function(value) {
		return this._v('immutable', value);
	};
	mapobjectbase.prototype.layer = function(value) {
		return this._v('layer', value);
	};
	mapobjectbase.prototype.position = function(x, y) {
		this.p = this.p || new game.position();
		this.p.set(x, y);
		return this.p;
	};
	mapobjectbase.prototype._v = function(property, value) {
		if (value != null)
			this['_' + property] = value;
		return this['_' + property] || 0;
	};
	var types = {
		ground : function() {
			this.color = '#401f0b';
			this.layer(0);
		},
		grass : function() {
			this.color = '#1d400b';
			this.layer(0);
		},
		brickwall : function() {
			this.color = '#b22222';
			this.layer(1);
			this.rigid(true);
			this.health(20);
		},
		stonewall : function() {
			this.color = '#d9d9d9';
			this.layer(1);
			this.rigid(true);
			this.immutable(true);
		}
	};

	for (var t in types) {
		if (!types.hasOwnProperty(t))
			continue;

		types[t].prototype = new mapobjectbase;
		game.Map[t] = types[t];
	};

})();

