var Item = require('./Item');

class Aventurer extends Item {
    constructor(x, y, type, name, direction, moves) {
        super(x, y, type);
        this.name = name;
        this.direction = direction;
        this.moves = moves;
        this.score = 0;
    }
    
    getDirection() {
        return this.direction;
    }

    getPosition() {
        return { 
            x: this.x, 
            y: this.y
        };
    }

    getScore() {
        return this.score;
    }

    turnLeft() {
        switch (this.direction) {
            case 'N': this.direction = 'W'; break;
            case 'S': this.direction = 'E'; break;
            case 'W': this.direction = 'S'; break;
            case 'E': this.direction = 'N'; break;
        }
    }
    turnRight() {
        switch (this.direction) {
            case 'N': this.direction = 'E'; break;
            case 'S': this.direction = 'W'; break;
            case 'W': this.direction = 'N'; break;
            case 'E': this.direction = 'S'; break;
        }
    }

    advance() {
        switch (this.direction) {
            case 'N': this.y = this.y > 1 ? this.y - 1 : 0; break;
            case 'S': this.y = this.y + 1; break;
            case 'W': this.x = this.x > 1 ? this.x - 1 : 0; break;
            case 'E': this.x = this.x + 1; break;
        }
    }

    getNextMovePosition(width, height) {
        let newX = this.x; let newY = this.y;
        switch(this.direction) {
            case 'N': {
                newY = this.y != 0 ? this.y - 1 : 0;
                break;
            }
            case 'S': {
                newY = this.y < height ? this.y + 1  : this.y;
                break;
            }
            case 'W': {
                newX = this.x != 0 ? this.x - 1 : 0;
                break;
            }
            case 'E': {
                newX = this.x < width ? this.x + 1 : this.x;
                break;
            }
        }

        return {
            x: newX,
            y: newY
        }
    }

    takeTreasure() {
        this.score++;
    }

    output() {
        return `A-${this.name}-${this.x}-${this.y}-${this.direction}-${this.score}\n`;
    }
}

module.exports = Aventurer;