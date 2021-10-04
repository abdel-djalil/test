var Mountain = require('./mountain');
var Treasure = require('./treasure');
var Aventurer = require('./aventurer')

class Map { 
    constructor(x, y) {
        this.width = x - 1;
        this.height = y - 1 ;
        this.aventurers = [];
        this.mountains = [];
        this.treasures = [];
        this.init();
    }

    init() {
        this.mapInfo = new Array(this.width + 1).fill('-').map(() => new Array(this.height + 1).fill('-'));
    }

    getWidth() {
        return this.width;
    }
    
    getHeight() {
        return this.height;
    }

    getMapInfo() {
        return this.mapInfo;
    }

    populateMap(item) {
        const [type] = item.split('-');
        switch(type) {
            case 'M' : {
                const [type, x, y] = item.split('-');
                const objectToInject = new Mountain(parseInt(x), parseInt(y), type); 
                this.mapInfo[x][y] = objectToInject;
                this.mountains.push(objectToInject);
                break;
            }
            case 'T' : { 
                const [type, x, y, remain] = item.split('-');
                const objectToInject = new Treasure(parseInt(x), parseInt(y), type, remain); 
                this.mapInfo[x][y] = objectToInject;
                this.treasures.push(objectToInject);
                break; 
            }
            case 'A' : { 
                const [type, name, x, y, direction, moves] = item.split('-');
                const objectToInject = new Aventurer(parseInt(x), parseInt(y), type, name, direction, moves);
                this.mapInfo[x][y] = objectToInject;
                this.aventurers.push(objectToInject);
                break; 
            }
            case '#': {
                console.log('line to ignore'); break;
            }
            default: {
                throw Error('Error parsing item');
            }
        }
    }

    run() {
        this.aventurers.forEach(aventurer => {
            const moves = aventurer.moves.split("");
            moves.forEach(step => {
                this.moveOneStep(step, aventurer);
            });
        })
    }

    getAventurerByName(name) {
        return this.aventurers.find(av => av.name === name);
    }

    getTreasureByPosition({x, y}) {
        return this.treasures.find(t => t.x === x && t.y === y);
    }

    moveOneStep(step, person){    
        switch (step) {
            case 'D': {
                person.turnRight();
                break; }
            case 'G': {
                person.turnLeft();
                break; }
            case 'A': {
                const nextPosition = person.getNextMovePosition(this.width, this.height);
                if(this.checkObstacle(nextPosition, person)) {
                    person.advance();
                    this.updateMap();
                }
                break;
            }
        }
    }

    updateMap() {
        this.init();
        this.aventurers.forEach(v => {
            this.injectItemIntoMap(v);
        });
        this.mountains.forEach(m => {
            this.injectItemIntoMap(m);
        });
        this.treasures.forEach(t => {
            this.injectItemIntoMap(t);
        });
    }

    injectItemIntoMap(item) {
        this.mapInfo[item.x][item.y] = item;
    }
    
    checkObstacle(position, person) {
        if (position && !isNaN(position.x) && !isNaN(position.y)) {
            const obstacles = [...this.aventurers, ...this.mountains];
            const freeToMove = obstacles.find(ob => ob.x === position.x && ob.y === position.y) === undefined;
            const treasureToPeek = this.treasures.find(t => t.x === position.x && t.y === position.y);
            if (freeToMove && treasureToPeek) {
                if (treasureToPeek.getRemain() > 0) {
                    treasureToPeek.reduce();
                    person.takeTreasure();
                }
            }
            return freeToMove;
        }
        throw Error('Error parsing position'); 
    }

    output() {
        let output= `C-${this.width + 1}-${this.height + 1}\n`;
        const items = [...this.aventurers, ...this.mountains, ...this.treasures];
        items.forEach(item => {
            output += item.output();
        });
        return output;
    }

}
module.exports = Map;
