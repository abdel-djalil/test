var fs = require('fs');
var Map = require('./models/map');

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}
let entries ;
const filename = process.argv[2];

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    const entries = data.split("\n");
    const mapDefinition = entries.find(entry => entry.length > 0 && entry[0] === "C").split("-");
    const map = new Map(mapDefinition[1], mapDefinition[2])
    const itemToInject = entries.filter(entry => entry.length > 0 && entry[0] != "C" && entry[0] != '#');
    itemToInject.forEach(item => {
        map.populateMap(item);
    })
    map.run();
    let output = map.output();
    
    fs.writeFile("output/output.txt", output, function(err) {
        if (err) {
            return console.log(err);
        }
    })
});


