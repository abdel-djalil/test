import { Map } from '../src/main';
import Aventurer from '../src/Aventurer';

const map = new Map(5,5);
const map2 = new Map(4, 6);


beforeEach(() => {
    map.init();
    map2.init();
});

afterEach(() => {
    map.init();
    map.aventurers = [];
    map.mountains = [];
    map.treasures = [];
    map2.init();
    map2.aventurers = [];
    map2.mountains = [];
    map2.treasures = [];
});


test('init map ', () => {
    expect(map2.getMapInfo()[0][0]).toBe('-');
    expect(map2.getMapInfo()[1][2]).toBe('-');
    expect(map2.getMapInfo()[2][2]).toBe('-');
    expect(map2.getMapInfo()[1][9]).toBe(undefined);
});

test('populate map : add Mountain', () => {
    map.populateMap("M-1-1");
    expect(map.getMapInfo()[1][1].type).toBe('M');
    expect(map.getMapInfo()[1][1].x).toBe(1);
    expect(map.getMapInfo()[1][1].y).toBe(1);
});

test('populate map : add Tresor', () => {
    map.populateMap("T-2-2-2");
    expect(map.getMapInfo()[2][2].type).toBe('T');
    expect(map.getMapInfo()[2][2].x).toBe(2);
    expect(map.getMapInfo()[2][2].y).toBe(2);
    expect(map.getMapInfo()[2][2].remain).toBe(2);
});


test('populate map : add Adventurer', () => {
    map.populateMap("A-TITI-1-2-S-AADADA");
    expect(map.getMapInfo()[1][2].type).toBe('A');
    expect(map.getMapInfo()[1][2].name).toBe('TITI');
    expect(map.getMapInfo()[1][2].direction).toBe('S');
    expect(map.getMapInfo()[1][2].moves).toBe('AADADA');
    expect(map.getMapInfo()[1][2].x).toBe(1);
    expect(map.getMapInfo()[1][2].y).toBe(2);
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
    expect(av.direction).toBe('N');
    av.turnLeft()
    expect(av.direction).toBe('W');
    av.turnLeft()
    expect(av.direction).toBe('S');
    av.turnLeft()
    expect(av.direction).toBe('E');
});


test('Aventurer: turn right ', () => {
    const describe = "A-TOTO-1-2-N-ADAADA";
    const [type, name, x, y, direction, moves] = describe.split('-');
    const av = new Aventurer(parseInt(x), parseInt(y), type, name, direction, moves);
    expect(av.direction).toBe('N');
    av.turnRight()
    expect(av.direction).toBe('E');
    av.turnRight()
    expect(av.direction).toBe('S');
    av.turnRight()
    expect(av.direction).toBe('W');
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
    expect(av.direction).toBe('S');
    map.moveOneStep('D', av);
    expect(av.x).toBe(1);
    expect(av.y).toBe(3);
    expect(av.direction).toBe('W');
    map.moveOneStep('A', av);
    expect(av.x).toBe(0);
    expect(av.y).toBe(3);
    map.moveOneStep('A', av);
    expect(av.x).toBe(0);
    expect(av.y).toBe(3);
    map.moveOneStep('G', av);
    expect(av.x).toBe(0);
    expect(av.y).toBe(3);
    expect(av.direction).toBe('S');
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
    expect(treasure_1_3.remain).toBe(1);
    expect(ada.getScore()).toBe(1);
    map.moveOneStep('A', ada);
    map.moveOneStep('A', toto);
    expect(toto.x).toBe(1);
    expect(toto.y).toBe(3);
    expect(treasure_1_3.remain).toBe(0);
    expect(toto.getScore()).toBe(1);
    map.moveOneStep('D', toto);
    map.moveOneStep('A', toto);
    map.moveOneStep('A', titi);
    expect(titi.x).toBe(1);
    expect(titi.y).toBe(3);
    expect(titi.getScore()).toBe(0);
    expect(treasure_1_3.remain).toBe(0);
});

