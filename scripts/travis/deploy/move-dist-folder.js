var program = require('commander');
var fs = require('fs');

replaceHrefInIndex = (href) => {
    fs.readFile(`demo-shell/dist/index.html`, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        let result = data.replace(`base href="/"`, `base href=\"/${href}/\"`);

        fs.writeFile(`demo-shell/dist/index.html`, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
};


async function main() {

    program
        .version('0.1.0')
        .option('--base-href  [type]', '')
        .parse(process.argv);

        replaceHrefInIndex(program.baseHref);
}

main();
