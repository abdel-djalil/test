var Item = require('./Item');

class Treasure extends Item {
    constructor(x, y, type, remain) {
        super(x, y, type);
        this.remain = parseInt(remain);
    }

    reduce() {
        if (this.remain > 0) {
            this.remain = this.remain - 1;
        }
    }

    getRemain() {
        return this.remain;
    }

    output() {
        return `T-${this.x}-${this.y}-${this.remain}\n`;
    }
}

module.exports = Treasure;