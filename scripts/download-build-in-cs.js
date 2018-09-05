var program = require('commander');
var AlfrescoApi = require('alfresco-js-api-node');
var http = require('http');

var fs = require('fs');
var path = require('path');
var archiver = require('archiver');
var unzipper = require('unzipper');

var exec = require('child_process').exec;

replaceHrefInIndex = (folder) => {
    fs.readFile(`demo-shell/${folder}/index.html`, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        var result = data.replace(`base href="/"`, `base href=\"/${folder}/\"`);

        fs.writeFile(`demo-shell/${folder}/index.html`, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

async function main() {

    program
        .version('0.1.0')
        .option('-p, --password [type]', 'password')
        .option('-u, --username  [type]', 'username')
        .option('--base-href  [type]', '')
        .option('-f, --folder [type]', 'Name of the folder')
        .option('-host, --host [type]', 'URL of the CS')
        .parse(process.argv);

    let alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: program.host
    });

    alfrescoJsApi.login(program.username, program.password);

    let zipDemoNode;

    try {
        zipDemoNode = await alfrescoJsApi.nodes.getNode('-my-', {
            'relativePath': `Builds/${program.folder}/demo.zip`
        });
    } catch (error) {
        console.log('error:  ' + error);
    }

    const url = await alfrescoJsApi.content.getContentUrl(zipDemoNode.entry.id, true);

    console.log('Download zip');

    let outputFolder = program.baseHref ? program.baseHref : 'dist';

    var file = fs.createWriteStream('demo.zip');
    http.get(`http://${url}`, (response) => {
        response.pipe(file);
        file.on('finish', async () => {
            console.log('Unzip Demo ' + path.join(__dirname, '../demo.zip'));
            fs.createReadStream(path.join(__dirname, '../demo.zip'))
                .pipe(unzipper.Extract({path: path.join(__dirname, '../demo-shell')}))
                .on('finish', () => {

                    let oldFolder = path.join(__dirname, `../demo-shell/demo.zip`)
                    let newFolder = path.join(__dirname, `../demo-shell/${outputFolder}`)

                    console.log(`mv ${oldFolder} ${newFolder}`);

                    exec(`mv ${oldFolder} ${newFolder}`, (err, stdout, stderr) => {
                        if (err) {
                            console.log(`err: ${err}`);
                            return;
                        }

                        if(program.baseHref) {
                            replaceHrefInIndex(outputFolder);
                        }
                    });
                })
        });
    });

}

main();
