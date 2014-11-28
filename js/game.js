/**
 * main game file
 * mainloop is here 
 */
'use strict';
var game = game || {};
game.turnDebug = function(value) {
	if (value === undefined)
		value = !game.debug;

	document.body.setAttribute('id', value ? 'debug' : '');
	game.debug = value;
};

(function() {

	var framerate_draw = 20, framerate_game = 20;

	var date = new Date();

	var displayable_side_sizepx = 200;
	//sizes of the viewed part of the map

	var canvas_layers = [];

	var game_on = false;

	var map, tank, tank_control = {};

	//to reg key down events
	var keyboard_controller = {
		length : 0
	};
	game.AIO = [];
	game.initGame = function() {

		//create the five layers of canvases
		var canvas_container = document.getElementById('canvas_container');
		for (var i = 0; i < 5; i++) {
			var _temp = document.createElement('canvas');
			_temp.setAttribute('id', 'canvas_level' + i);
			_temp.setAttribute('height', displayable_side_sizepx + 'px');
			_temp.setAttribute('width', displayable_side_sizepx + 'px');
			_temp.c2d = _temp.getContext("2d");
			canvas_layers.push(_temp);
			canvas_container.appendChild(_temp);
		};

		//create map
		game.map = map = game.maps.simplemap;
		game.tank = tank = new game.Tank(map.spawnpoint);

		var aitank1 = new game.TankAI(new game.Tank(new game.position(60, 60)));
		var aitank2 = new game.TankAI(new game.Tank(new game.position(10, 10)));
		
		game.AIO.push(aitank1);
		game.AIO.push(aitank2);

		$(document).keydown(function(e) {
			if (!keyboard_controller.hasOwnProperty(e.which))
				keyboard_controller.length++;
			keyboard_controller[e.which] = true;
		});

		$(document).keyup(function(e) {
			if (keyboard_controller.hasOwnProperty(e.which))
				keyboard_controller.length--;
			delete keyboard_controller[e.which];
		});

	};

	game.startGame = function() {
		//TODO:hide menu, show canvases
		game_on = true;
		frameg();
		framed();
	};

	game.stopGame = function() {
		game_on = false;
		//TODO: show menu, hide canvases
	};

	game.GO = [];
	game.addGO = function(go) {
		game.GO.push(go);
	};

	game.removeGO = function(go) {
		//TODO: add reaction
		throw 'this method is not implemented';
	};

	/* checks collision of two objects */
	game.checkCollision = function(a, b) {
		if ((a.p.x >= b.p.x && a.p.x <= b.p.x + b.w) && (a.p.y >= b.p.y && a.p.y <= b.p.y + b.h))
			return true;

		if ((b.p.x >= a.p.x && b.p.x <= a.p.x + a.w) && (b.p.y >= a.p.y && b.p.y <= a.p.y + a.h))
			return true;

		return false;
	};

	function frameg() {//game frame

		console.log('game frame started');
		//для просчёта скоростей, этц
		var _frameLastCall = Date.now(), _fdiffer = 0, _tempframeLastCall;
		(function _frameg() {

			if (!game_on)
				return;

			_tempframeLastCall = Date.now();
			_fdiffer = _tempframeLastCall - _frameLastCall;
			_frameLastCall = _tempframeLastCall;

			//self-living GO start
			for (var i = 0; i < game.GO.length; i++) {
				game.GO[i].frame(_fdiffer);
			};
			//GO end

			//Game controlling start
			var move_dir = '';
			if (keyboard_controller.length) {
				for (var k in keyboard_controller) {
					if (k === 'length' || !keyboard_controller.hasOwnProperty(k))
						continue;

					switch(k) {
						case '97':
						case '37':
							move_dir = 'left';
							break;
						case '119':
						case '38':
							move_dir = 'up';
							break;
						case '100':
						case '39':
							move_dir = 'right';
							break;
						case '115':
						case '40':
							move_dir = 'down';
							break;
					};

					if (k === '90')
						tank.shoot_prime(_fdiffer);

					if (k === '88')
						tank.shoot_secondary(_fdiffer);

					if (game.debug)
						console.log('user pressed: ' + k);
				}

				if (move_dir)
					tank.move(move_dir, _fdiffer);

				if (game.debug && keyboard_controller.length)
					console.log('- controlled - pressed ' + keyboard_controller.length + ' keys');
			}
			//Game controlling end

			//AI start
			for (var i = 0, j = game.AIO.length; i < j; i++) {
				game.AIO[i].frame(_fdiffer);
				//зачем сюда фрейм дифф?
			};
			//AI end

			//Collisions

			//Collisions end

			if (game_on)
				setTimeout(_frameg, framerate_game);

		})();

	};

	function framed() {//frame draw

		console.log('draw frame started');

		//для подсчёта фреймрэйта
		var _frameLastCall = Date.now(), _fdiffer = 0, _tempframeLastCall, _framelength;

		var FPSpool = [], _framespoollength = 10;
		var fps_display = document.getElementById('fps_display');
		//shortcuts. хз зачем
		var t = tank.t, p = tank.p;

		(function _framed() {
			if (!game_on)
				return;

			_tempframeLastCall = Date.now();
			_fdiffer = _tempframeLastCall - _frameLastCall;
			_frameLastCall = _tempframeLastCall;

			FPSpool.push(_tempframeLastCall);
			if (FPSpool.length > _framespoollength) {
				FPSpool.shift();
			}

			fps_display.innerText = ('' + 1000 / ((FPSpool[FPSpool.length - 1] - FPSpool[0]) / _framespoollength)).slice(0, 4);
			/*var offset = map.render(canvas_layers, p, );
			 var offset_x = 0, offset_y = 0;
			 if (offset) {
			 offset_x = offset.x;
			 offset_y = offset.y;
			 }

			 */

			for (var i = 0; i < canvas_layers.length; i++) {

				canvas_layers[i].c2d.clearRect(0, 0, displayable_side_sizepx, displayable_side_sizepx);

				//continue;

				if (!map.layers[i])
					continue;

				for (var j = 0; j < map.layers[i].length; j++) {
					var _o = map.layers[i][j];
					_o.render(canvas_layers[i].c2d);
				}
			}

			if (tank.image) {
				tank.image.draw(canvas_layers[2].c2d, p.x, p.y);
				if (game.debug)
					canvas_layers[2].c2d.fillRect(p.x - 1, p.y - 1, 2, 2);
			} else
				canvas_layers[2].c2d.fillRect(p.x, p.y, (Math.abs(t.x) + 1) * 5, (Math.abs(t.y) + 1) * 5);

			//AI start
			for (var i = 0, j = game.AIO.length; i < j; i++) {
				var t = game.AIO[i].tank;
				t.image.draw(canvas_layers[2].c2d, t.p.x, t.p.y);
			};
			//AI end

			for (var i = 0; i < game.GO.length; i++) {
				game.GO[i].draw(canvas_layers[2].c2d);
			};

			_framelength = Date.now() - _frameLastCall;

			if (game.debug)
				console.log('frame draw lasted: ' + ('' + _framelength).slice(0, 5));
				
			if (game_on) {
				setTimeout(_framed, Math.max(4, framerate_draw - _framelength));
			}

		})();

	};

})();

$(function() {
	game.turnDebug(false);

	game.initGame();
	game.startGame();
});
