var fs = require("fs");
var path = require("path");
var ejs = require("ejs");

var templateFolder = path.resolve("tools", "doc", "yamlTemplates");
var outputFolder = path.resolve("docs", "sourceinfo");

if (process.argv.length < 3) {
    console.log("Error: Source filename required");
    process.exit();
}

console.log(`Processing ${process.argv[2]}`);

if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

var docData = JSON.parse(fs.readFileSync(path.resolve(process.argv[2]), "utf8"));
var tempFilename = path.resolve(templateFolder, "template.ejs");
var tempSource = fs.readFileSync(tempFilename, "utf8");
var template = ejs.compile(
    tempSource,
    {
        filename: tempFilename,
        cache: true
    }
);

searchItemsRecursively(docData);

function searchItemsRecursively(item) {
    if (interestedIn(item.kind)) {

        processItem(item);
    } else if (item.children) {
        item.children.forEach(child => {
            searchItemsRecursively(child);
        });
    }
}

function interestedIn(itemKind) {
    return (itemKind === 128) || (itemKind === 256) || (itemKind === 4194304);
}


function processItem(item) {
    var docText = template(item);

    if( item.name  === 'Widget'){
        console.log('item ' + JSON.stringify(item.name ));
    }

    fs.writeFileSync(path.resolve(outputFolder, item.name + ".yml"), docText);
}
