class Block {
    static nr = 0;
    constructor() {
        this.nr = Block.nr++;
        this.height = 20;
        this.width = Block.nr * 30;
        this.x = 0;
        this.y = this.nr * (this.height + 1);
        this.strokeRgb = random_rgba();
        this.fillRgb = random_rgba(.8);
    }

    setCoordinates(coordinates) {
        this.x = coordinates.x;
        this.y = coordinates.y;
    }

    draw(ctx, radius = 5) {
        ctx.beginPath();
        ctx.moveTo(this.x + radius, this.y);
        ctx.lineTo(this.x + this.width - radius, this.y);
        ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + radius);
        ctx.lineTo(this.x + this.width, this.y + this.height - radius);
        ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - radius, this.y + this.height);
        ctx.lineTo(this.x + radius, this.y + this.height);
        ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - radius);
        ctx.lineTo(this.x, this.y + radius);
        ctx.quadraticCurveTo(this.x, this.y, this.x + radius, this.y);
        ctx.closePath();
        ctx.fillStyle = this.fillRgb;
        ctx.strokeStyle = this.strokeRgb;
        ctx.fill();
        ctx.stroke();
    }

    isInside(mousePos) {
        if(mousePos.x >= this.x && mousePos.x <= this.x + this.width && mousePos.y >= this.y && mousePos.y <= this.y + this.height) return true;
        else return false;
    }
};

function drawBlocks(ctx, blockToSkip) {
    blocks.forEach(element => {
        if(element !== blockToSkip)     
            element.draw(ctx);
    });
}

////////////////////////////////// MOUSE EVENTS //////////////////////////////////

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var mouseIsDown = false;


var nrOfBlocks = 3;
var blocks = [new Block(), new Block(), new Block()];
drawBlocks(ctx);


var blockToMove = null;
var dist;

canvas.onmousedown = event => {
    mouseIsDown = true;
    let mousePos = getMousePos(canvas, event);
    for(let element of blocks) {
        if(element.isInside(mousePos)) {
            blockToMove = element;
            dist = {
                x: mousePos.x - blockToMove.x,
                y: mousePos.y - blockToMove.y
            }
            break;
        }
    }
}

canvas.onmouseup = event => {
    mouseIsDown = false;
    blockToMove = null;
    let mousePos = getMousePos(canvas, event);
}

canvas.onmousemove = event => {
    if(mouseIsDown && blockToMove) {
        let mousePos = getMousePos(canvas, event);
        let newPos = {
            x: mousePos.x - dist.x,
            y: mousePos.y - dist.y
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBlocks(ctx, blockToMove);
        blockToMove.setCoordinates(newPos);
        blockToMove.draw(ctx);
    }
}
