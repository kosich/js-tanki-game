/**
 * predefined maps
 *///
'use strict';
(function() {
	game = game || {};
	var mapprototype = {
		render : function(canvas, cc, p, sidepx) {
			var offset = new game.position();

			offset.x = sidepx / 2 - p.x;
			offset.y = sidepx / 2 - p.y;

			var minx = -1 * ($(canvas).width() - sidepx);
			var miny = -1 * ($(canvas).height() - sidepx);
			offset.x = offset.x >= 0 ? 0 : offset.x <= minx ? minx : offset.x;
			offset.y = offset.y >= 0 ? 0 : offset.y <= miny ? miny : offset.y;

			$(canvas).css('left', offset.x).css('top', offset.y);

			for (var i = 0; i < this.objects.length; i++) {
				for (var j = 0; j < this.objects[i].length; j++) {
					var o = this.objects[i][j];
					o.render(cc, i * mapobject.size, j * mapobject.size);
				};
			};
			return offset;
		},
		addObject : function(o) {
			this.layers[o.layer()] = this.layers[o.layer()] || [];
			this.layers[o.layer()].push(o);

			if (o.rigid())
				this.RO.push(o);
		}
	}
	var map = function(w, h, spawnpoint) {
		this.width = w;
		this.height = h;
		this.spawnpoint = new game.position(spawnpoint);
		this.layers = [];
		//levels with objects
		this.RO = [];
		//rigid objects
	}

	map.prototype = mapprototype;

	game.maps = {};

	game.maps.simplemap = (function() {
		var h = 200, w = 200;
		var m = new map(w, h, new game.position(16, 16));

		var msize = game.Map.size;

		// create new map

		for (var i = 0; i < w; i += msize) {
			for (var j = 0; j < h; j += msize) {

				//add floor grass
				var ground = new game.Map.grass;
				m.addObject(ground);
				ground.position(i, j);

				var o = null;
				//put surrounding walls
				if (i == 0 || j == 0 || i == w - msize || j == h - msize)
					o = new game.Map.stonewall();
				else {//randomly put brick walls
					var tanksidesize = 100;
					if (Math.random() > 0.5 && !((i >= (m.spawnpoint.x - tanksidesize) && i <= (m.spawnpoint.x + tanksidesize)) && (j >= (m.spawnpoint.y - tanksidesize) && j <= (m.spawnpoint.y + tanksidesize))))
						o = new game.Map.brickwall();
				}

				if (o) {
					o.position(i, j);
					m.addObject(o);
				}

			};
		};
		return m;
	})();

})();

