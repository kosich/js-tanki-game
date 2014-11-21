
function Position(x, y){
    this.x = x;
    this.y = y;
}

Position.prototype.add = function(dist){
    this.x += dist.x;
    this.y += dist.y;
};
