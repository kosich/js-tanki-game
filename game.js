window.addEventListener('DOMContentLoaded', function(){
    var canvas = document.getElementById('canvas'),
        cc = canvas.getContext('2d'),
        dateStart = new Date(),
        _keyspressed = [], keyspressed; 

    function frame(){
        //console.log(new Date() - dateStart);
        //
        keyspressed = _keyspressed.map(function(key){
            return String.fromCharCode(key.keyCode);
        }).sort();
        _keyspressed = [];

        if(keyspressed.length){
            console.log(keyspressed);
        }
        //make moves
        //ai moves
        //draw
        //
        //
        window.requestAnimationFrame(frame);
    }

    function start(){
        console.log('started');

        window.addEventListener('keypress', function(ke){
            _keyspressed.push(ke);
        });
           
        frame();
    }

    start();
    //cc.fillRect(0,0,20,20);
});

function Base(){
    this.pos = new Position();
}

function Tank(){

}

Tank.prototype.move = function(modifier){
    this.pos.add(modifier);
};

function Position(x, y){
    this.x = x;
    this.y = y;
}

Position.prototype.add = function(dist){
    this.x += dist.x;
    this.y += dist.y;
};

