import Item from "./Item";

export default class Aventurer extends Item {
    constructor(x, y, type, name, direction, moves) {
        super(x, y, type);
        this.name = name;
        this.direction = direction;
        this.moves = moves;
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
}