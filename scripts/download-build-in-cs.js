var program = require('commander');
var fs = require('fs');
var path = require('path');
var ncp = require('ncp').ncp;
var rimraf = require('rimraf');

ncp.limit = 16;

replaceHrefInIndex = (href) => {
    fs.readFile(`demo-shell/dist/${href}/index.html`, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        let result = data.replace(`base href="/"`, `base href=\"/${href}/\"`);

        fs.writeFile(`demo-shell/dist/${href}/index.html`, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
};


async function main() {

    program
        .version('0.1.0')
        .option('--base-href  [type]', '')
        .parse(process.argv);


    let outputTemp = path.resolve(__dirname, '../demo-shell/', program.baseHref);
    console.log('output ' + outputTemp);

    let distFolder = path.resolve(__dirname, '../demo-shell/dist');

    fs.rename(distFolder, outputTemp, (err) => {
        if (err) throw err;
        console.log('renamed complete');

        let distFolderNew = path.resolve(__dirname, '../demo-shell/dist', program.baseHref);

        if (!fs.existsSync(distFolderNew)){
            fs.mkdirSync(distFolder);
            fs.mkdirSync(distFolderNew);
        }

        ncp(outputTemp, distFolderNew, (err) => {
            if (err) {
                return console.error(err);
            }

            replaceHrefInIndex(program.baseHref);

            rimraf(outputTemp,  ()=> { console.log('output temp removed'); });

        });

    });

}

main();


