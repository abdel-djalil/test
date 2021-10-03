import Mountain from "./Mountain";
import Treasure from "./Treasure";
import Aventurer from "./Aventurer";


export class Map { 
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
                this.aventurers.push(objectToInject);
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

    runAventurer(name) {
        const aventurer = this.getAventurerByName(name);
        const moves = aventurer.moves.split("");
        moves.forEach(step => {
            this.moveOneStep(step, aventurer);
        });
    }

    getAventurerByName(name) {
        return this.aventurers.find(av => av.name === name);
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
                if(this.checkObstacle(nextPosition)) {
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
    
    checkObstacle(position) {
        if (position && !isNaN(position.x) && !isNaN(position.y)) {
            return this.mapInfo[position.x][position.y] === "-";
        }
        throw Error('Error parsing position'); 
    }

}





