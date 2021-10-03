import Item from "./Item";

export default class Treasure extends Item {
    constructor(x, y, type, remain) {
        super(x, y, type);
        this.remain = parseInt(remain);
    }
}