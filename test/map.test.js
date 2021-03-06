var Map = require('../src/models/map');
var Aventurer = require('../src/models/aventurer');

const map = new Map(5,5);
const map2 = new Map(4, 6);


afterEach(() => {
    map.init();
    map2.init();
});


test('populate map : add Mountain', () => {
    map.populateMap("M-1-1");
    expect(map.mountains[0].type).toBe('M');
    expect(map.mountains[0].x).toBe(1);
    expect(map.mountains[0].y).toBe(1);
});

test('populate map : add Tresor', () => {
    map.populateMap("T-2-2-2");
    expect(map.treasures[0].type).toBe('T');
    expect(map.treasures[0].x).toBe(2);
    expect(map.treasures[0].y).toBe(2);
    expect(map.treasures[0].getRemain()).toBe(2);
});


test('populate map : add Adventurer', () => {
    map.populateMap("A-TITI-1-2-S-AADADA");
    expect(map.aventurers[0].type).toBe('A');
    expect(map.aventurers[0].name).toBe('TITI');
    expect(map.aventurers[0].getDirection()).toBe('S');
    expect(map.aventurers[0].moves).toBe('AADADA');
    expect(map.aventurers[0].x).toBe(1);
    expect(map.aventurers[0].y).toBe(2);
});

test('populate map : add non managed Item', () => {
    expect(() => map.populateMap("S-1-1")).toThrow('Error parsing item');
});

test('populate map : add Mountain', () => {
    map.populateMap("M-1-1");
    map.populateMap("T-2-2-2");
    map.populateMap("A-TITI-1-2-N-ADAADA");
});

test('Aventurer:  turn left', () => {
    const describe = "A-TOTO-1-2-N-ADAADA";
    const [type, name, x, y, direction, moves] = describe.split('-');
    const av = new Aventurer(parseInt(x), parseInt(y), type, name, direction, moves);
    expect(av.getDirection()).toBe('N');
    av.turnLeft()
    expect(av.getDirection()).toBe('W');
    av.turnLeft()
    expect(av.getDirection()).toBe('S');
    av.turnLeft()
    expect(av.getDirection()).toBe('E');
});


test('Aventurer: turn right ', () => {
    const describe = "A-TOTO-1-2-N-ADAADA";
    const [type, name, x, y, direction, moves] = describe.split('-');
    const av = new Aventurer(parseInt(x), parseInt(y), type, name, direction, moves);
    expect(av.getDirection()).toBe('N');
    av.turnRight()
    expect(av.getDirection()).toBe('E');
    av.turnRight()
    expect(av.getDirection()).toBe('S');
    av.turnRight()
    expect(av.getDirection()).toBe('W');
});


test('Aventurer: advance ', () => {
    const describe = "A-TOTO-1-2-S-ADAADA";
    const [type, name, x, y, direction, moves] = describe.split('-');
    const av = new Aventurer(parseInt(x), parseInt(y), type, name, direction, moves);
    expect(av.x).toBe(1);
    expect(av.y).toBe(2);
    av.advance();
    expect(av.y).toBe(3);
    av.advance();
    expect(av.y).toBe(4);
    av.turnLeft();
    av.advance();
    expect(av.x).toBe(2);
    av.advance();
    expect(av.x).toBe(3);
    av.turnLeft();
    av.advance();
    expect(av.y).toBe(3);
    av.advance();
    expect(av.y).toBe(2);
    av.advance();
    expect(av.y).toBe(1);
    av.advance();
    expect(av.y).toBe(0);
    av.advance();
    expect(av.y).toBe(0);
});

test('Aventurer: move one step ', () => {
    map.populateMap("A-TOTO-1-2-S-ADAAGA");
    const av = map.getAventurerByName("TOTO");
    map.moveOneStep('A', av);
    expect(av.x).toBe(1);
    expect(av.y).toBe(3);
    expect(av.getDirection()).toBe('S');
    map.moveOneStep('D', av);
    expect(av.x).toBe(1);
    expect(av.y).toBe(3);
    expect(av.getDirection()).toBe('W');
    map.moveOneStep('A', av);
    expect(av.x).toBe(0);
    expect(av.y).toBe(3);
    map.moveOneStep('A', av);
    expect(av.x).toBe(0);
    expect(av.y).toBe(3);
    map.moveOneStep('G', av);
    expect(av.x).toBe(0);
    expect(av.y).toBe(3);
    expect(av.getDirection()).toBe('S');
    map.moveOneStep('A', av);
    expect(av.x).toBe(0);
    expect(av.y).toBe(4);
    map.moveOneStep('A', av);
    expect(av.x).toBe(0);
    expect(av.y).toBe(4);
});

test('Aventurer: getNextPosition ', () => {
    map.populateMap("A-ADA-1-2-S-ADAAGA");
    const av = map.getAventurerByName("ADA");
    expect(av.getNextMovePosition(map.getWidth(), map.getHeight()).x).toBe(1);
    expect(av.getNextMovePosition(map.getWidth(), map.getHeight()).y).toBe(3);
    expect(av.getPosition().y).toBe(2);
});

test('Map: check Obstacle ', () => {
    map.populateMap("A-ADA-1-2-S-A");
    map.populateMap("A-FIFO-0-4-E-A");
    map.populateMap("M-1-3");
    const ada = map.getAventurerByName("ADA");
    const fifo = map.getAventurerByName("FIFO");
    map.moveOneStep('A', ada);
    expect(ada.x).toBe(1);
    expect(ada.y).toBe(2);
    map.moveOneStep('A', fifo);
    expect(fifo.x).toBe(1);
    expect(fifo.y).toBe(4);
});

test('Aventurer: take treasure ', () => {
    map.populateMap("A-ADA-1-2-S-AA");
    map.populateMap("A-TOTO-2-3-W-AA");
    map.populateMap("A-TITI-0-3-E-A");
    map.populateMap("T-1-3-2");
    const ada = map.getAventurerByName("ADA");
    const toto = map.getAventurerByName("TOTO");
    const titi = map.getAventurerByName("TITI");
    map.moveOneStep('A', ada);
    const treasure_1_3 = map.getTreasureByPosition({x: 1, y:3});
    expect(ada.x).toBe(1);
    expect(ada.y).toBe(3);
    expect(treasure_1_3.getRemain()).toBe(1);
    expect(ada.getScore()).toBe(1);
    map.moveOneStep('A', ada);
    map.moveOneStep('A', toto);
    expect(toto.x).toBe(1);
    expect(toto.y).toBe(3);
    expect(treasure_1_3.getRemain()).toBe(0);
    expect(toto.getScore()).toBe(1);
    map.moveOneStep('D', toto);
    map.moveOneStep('A', toto);
    map.moveOneStep('A', titi);
    expect(titi.x).toBe(1);
    expect(titi.y).toBe(3);
    expect(titi.getScore()).toBe(0);
    expect(treasure_1_3.getRemain()).toBe(0);
});


test('Simulate : run ', () => {
    map.populateMap("A-ADA-0-0-E-ADA");
    map.populateMap("A-TOTO-4-4-W-AADAA");
    map.run();
    const ada = map.getAventurerByName("ADA");
    const toto = map.getAventurerByName("TOTO");
    expect(toto.x).toBe(2);
    expect(toto.y).toBe(2);
    expect(toto.getDirection()).toBe('N');
    expect(toto.getScore()).toBe(0);
    expect(ada.x).toBe(1);
    expect(ada.y).toBe(1);
    expect(ada.getDirection()).toBe('S');
});

test('Simulate : run and hunt', () => {
    map.populateMap("A-ADA-0-0-E-ADAAAA");
    map.populateMap("A-TOTO-4-4-W-AADAA");
    map.populateMap("M-2-3");
    map.populateMap("T-1-3-2");
    const treasure_1_3 = map.getTreasureByPosition({x: 1, y: 3});
    expect(treasure_1_3.getRemain()).toBe(2);
    map.run();
    const ada = map.getAventurerByName("ADA");
    const toto = map.getAventurerByName("TOTO");
    expect(ada.x).toBe(1);
    expect(ada.y).toBe(4);
    expect(ada.getDirection()).toBe('S');
    expect(ada.getScore()).toBe(1);
    expect(treasure_1_3.getRemain()).toBe(1);
    expect(toto.x).toBe(2);
    expect(toto.y).toBe(4);
    expect(toto.getDirection()).toBe('N');
    expect(toto.getScore()).toBe(0);
});
