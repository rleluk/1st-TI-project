class Block {
    constructor(width, height, nr) {
        this.height = height;
        this.width = width;
        this.x = 0;
        this.y = 0;
        this.rgb = random_rgba();
        this.active = false;
        this.nrOfBlock = nr;
    }

    isActive = () => this.active;
    
    setActive = (act) => this.active = act;

    setCoordinates(coordinates) {
        this.x = coordinates.x;
        this.y = coordinates.y;
    }

    getNoB = () => this.nrOfBlock;

    isInside = (mousePos) => (mousePos.x >= this.x && mousePos.x <= this.x + this.width && mousePos.y >= this.y && mousePos.y <= this.y + this.height) ? true : false;

    draw(radius = 10) {
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
};

class Pole {
    constructor(nr) {
        this.nr = nr;
        this.xStart = areaWidth * this.nr; 
        this.xEnd = areaWidth * (this.nr + 1);
        this.center = this.xStart + (this.xEnd - this.xStart) / 2;
        this.blocks = [];
    }

    add(block) {
        let length = this.blocks.length;
        let last = this.blocks[length - 1];
        if(last) last.setActive(false);
        block.setActive(true);
        block.setCoordinates({x: this.center - block.width / 2 - (this.nr * 10 - 10), y: 360 - (length + 1) * 20}); 
        this.blocks.push(block);
    }

    remove() {
        let length = this.blocks.length;
        let newLast = this.blocks[length - 2];
        if(newLast) newLast.setActive(true);
        return this.blocks.pop();
    }

    getLastBlock = () => this.blocks.slice(-1)[0];

    isInside = (x) => (x >= this.xStart && x <= this.xEnd) ? true : false;

    getSize = () => this.blocks.length;

    drawBlocks(blockToSkip = null) {
        this.blocks.forEach(block => {
            if(block !== blockToSkip)     
                block.draw();
        });
    }
}

////////////////////////////////// DRAWING BOARD //////////////////////////////////

function drawBoard(blockToSkip = null) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    poles.forEach(pole => pole.drawBlocks(blockToSkip));
}

function createBoardElements(nob) {
    let poles = [];
    for(let i = 0; i < 3; i++) 
        poles[i] = new Pole(i);
    for(let i = nob; i > 0; i--)
        poles[0].add(new Block(i * 25, 20, i));
    return poles;
}

function resetBoard() {
    nob = document.getElementById("numberOfBlocks").value;
    poles = createBoardElements(nob);
    countMoves = 0;
    drawBoard();
}

////////////////////////////////// MOUSE EVENTS //////////////////////////////////

function onMouseDown() {
    mouseIsDown = true;
    let mousePos = getMousePos(canvas, event);
    for(let pole of poles) {
        let lastBlock = pole.getLastBlock();
        if(lastBlock && lastBlock.isInside(mousePos) && lastBlock.isActive()) {
            poleOrigin = pole;
            blockToMove = pole.remove();
            dist = {
                x: mousePos.x - blockToMove.x,
                y: mousePos.y - blockToMove.y
            }
            break;
        }
    }
}

function onMouseUp() {
    mouseIsDown = false;
    let mousePos = getMousePos(canvas, event);
    if(blockToMove) {
        for(let pole of poles) {
            let lastBlock = pole.getLastBlock();
            if(pole.isInside(mousePos.x)) {
                if(!lastBlock || blockToMove.getNoB() < lastBlock.getNoB()) {
                    pole.add(blockToMove);
                    countMoves++;
                    if(pole !== poles[0] && pole.getSize() == nob) {
                        setTimeout(() => { 
                            alert(`Gratulacje! Udało Ci się przenieść wszystkie krążki w ${countMoves} ruchach!`);
                            resetBoard();
                        }, 200);
                    }
                }
                else poleOrigin.add(blockToMove);
            }
        }
    } 
    blockToMove = null;
    drawBoard();
}

function onMouseMove() {
    if(mouseIsDown && blockToMove) {
        let mousePos = getMousePos(canvas, event);
        let newPos = {
            x: mousePos.x - dist.x,
            y: mousePos.y - dist.y
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard(blockToMove);
        blockToMove.setCoordinates(newPos);
        blockToMove.draw();
    }
}
