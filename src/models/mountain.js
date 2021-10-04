var Item = require('./Item');

class Mountain extends Item {
    constructor(x, y, type) {
        super(x, y, type)
    }

    output() {
        return `M-${this.x}-${this.y}\n`;
    }
}

module.exports = Mountain;