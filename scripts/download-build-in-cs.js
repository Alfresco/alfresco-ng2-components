var program = require('commander');
var fs = require('fs');
var path = require('path');

replaceHrefInIndex = (href) => {
    fs.readFile(`demo-shell/${href}/index.html`, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        let result = data.replace(`base href="/"`, `base href=\"/${href}/\"`);

        fs.writeFile(`demo-shell/${href}/index.html`, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
};


async function main() {

    program
        .version('0.1.0')
        .option('--base-href  [type]', '')
        .parse(process.argv);


    let output = path.resolve(__dirname, '../demo-shell/', program.baseHref);
    console.log('output ' + output);

    fs.rename(path.resolve(__dirname, '../demo-shell/dist'),output,  (err)=> {
        if (err) throw err;
        console.log('renamed complete');
    });

    replaceHrefInIndex(program.baseHref);
}

main();


