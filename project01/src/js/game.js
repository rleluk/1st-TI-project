class Block {
    static nr = 0;
    constructor(width, height) {
        this.height = height;
        this.width = width;
        this.x = 0;
        this.y = 0;
        this.rgb = random_rgba();
        this.active = false;
    }

    isActive = () => this.active;
    
    setActive = (act) => this.active = act;

    setCoordinates(coordinates) {
        this.x = coordinates.x;
        this.y = coordinates.y;
    }

    draw(ctx, radius = 10) {
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
        ctx.fillStyle = this.rgb;
        ctx.strokeStyle = this.rgb;
        ctx.fill();
        ctx.stroke();
    }

    isInside(mousePos) {
        if(mousePos.x >= this.x && mousePos.x <= this.x + this.width && mousePos.y >= this.y && mousePos.y <= this.y + this.height) return true;
        else return false;
    }
};

class Pole {
    static width;
    static nr = 0;
    
    constructor(canvas) {
        Pole.width = canvas.width / 3;
        this.nr = Pole.nr++;
        this.xStart = Pole.width * this.nr; 
        this.xEnd = Pole.width * (this.nr + 1);
        this.center = this.xStart + (this.xEnd - this.xStart) / 2;
        this.blocks = [];
    }

    add(block) {
        let length = this.blocks.length;
        let last = this.blocks[length - 1];
        if(last) last.setActive(false);
        block.setActive(true);
        block.setCoordinates({x: this.center - block.width / 2 - (this.nr * 10 - 10), y: 360 - (length + 1) * 20}); // ??
        this.blocks.push(block);
    }

    remove() {
        let length = this.blocks.length;
        let newLast = this.blocks[length - 2];
        if(newLast) newLast.setActive(true);
        return this.blocks.pop();
    }

    isInside(x) {
        if(x >= this.xStart && x <= this.xEnd) return true;
        else return false;
    }
}

////////////////////////////////// DRAWING BOARD //////////////////////////////////

function drawBlocks(ctx, blocks, blockToSkip = null) {
    blocks.forEach(element => {
        if(element !== blockToSkip)     
            element.draw(ctx);
    });
}

function drawPoles(ctx, bgImg, poles, blockToSkip = null) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    poles.forEach(element => drawBlocks(ctx, element.blocks, blockToSkip));
}

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var bgImg = document.getElementById("source");

var poles = [];
for(let i = 0; i < 3; i++) 
    poles[i] = new Pole(canvas);

var nob = 4;
for(let i = nob; i > 0; i--)
    poles[0].add(new Block(i * 25, 20));

bgImg.addEventListener('load', event => {
    drawPoles(ctx, bgImg, poles);
});   

////////////////////////////////// MOUSE EVENTS //////////////////////////////////

var mouseIsDown = false;
var blockToMove = null;
var dist;

canvas.onmousedown = event => {
    mouseIsDown = true;
    let mousePos = getMousePos(canvas, event);
    let blocks = [...poles[0].blocks, ...poles[1].blocks, ...poles[2].blocks];
    // for(let element of blocks) {
    //     if(element.isInside(mousePos) && element.isActive()) {
    //         blockToMove = element;
    //         dist = {
    //             x: mousePos.x - blockToMove.x,
    //             y: mousePos.y - blockToMove.y
    //         }
    //         break;
    //     }
    // }
    for(let pole of poles) {
        for(let block of pole.blocks) {
            if(block.isInside(mousePos) && block.isActive()) {
                blockToMove = block;
                dist = {
                    x: mousePos.x - blockToMove.x,
                    y: mousePos.y - blockToMove.y
                }
                pole.remove();
                return;
            }
        }
    }
}

canvas.onmouseup = event => {
    mouseIsDown = false;
    let mousePos = getMousePos(canvas, event);
    for(let pole of poles) {
        if(pole.isInside(mousePos.x) && blockToMove) {
            pole.add(blockToMove);
        }
    }
    blockToMove = null;
    drawPoles(ctx, bgImg, poles);
}

canvas.onmousemove = event => {
    if(mouseIsDown && blockToMove) {
        let mousePos = getMousePos(canvas, event);
        let newPos = {
            x: mousePos.x - dist.x,
            y: mousePos.y - dist.y
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPoles(ctx, bgImg, poles, blockToMove);
        blockToMove.setCoordinates(newPos);
        blockToMove.draw(ctx);
    }
}
