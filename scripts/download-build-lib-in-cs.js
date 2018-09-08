var program = require('commander');
var AlfrescoApi = require('alfresco-js-api-node');
var http = require('http');

var fs = require('fs');
var path = require('path');
var archiver = require('archiver');
var unzip = require('unzip-stream');

var exec = require('child_process').exec;

var alfrescoJsApi;

downloadZip = async (url, outputFolder, pacakge) => {

     console.log(`Download ${pacakge}`)
     console.log(`OutputFolder ${outputFolder}`)
    var file = fs.createWriteStream(`${pacakge}.zip`);
    return await http.get(`http://${url}`, (response) => {
        response.pipe(file);
        file.on('finish', async () => {
            setTimeout(() => {
                console.log(`Unzip  ${pacakge}` + path.join(__dirname, `../${pacakge}.zip`));
                fs.createReadStream(path.join(__dirname, `../${pacakge}.zip`))
                    .pipe(unzip.Extract({path: path.join(__dirname, `../${outputFolder}/@alfresco/`)}))
                    .on('finish', () => {
                        setTimeout(() => {
                            let oldFolder = path.join(__dirname, `../${outputFolder}/@alfresco/${pacakge}`)
                            let newFolder = path.join(__dirname, `../${outputFolder}/@alfresco/adf-${pacakge}`)

                            fs.rename(oldFolder, newFolder, (err) => {
                                console.log('renamed complete');
                            });

                        }, 10000);
                    })
            })
        });
    });
}

getUrl = async (folder, pacakge) => {
    let zipDemoNode;

    try {
        zipDemoNode = await alfrescoJsApi.nodes.getNode('-my-', {
            'relativePath': `Builds/${folder}/${pacakge}.zip`
        });
    } catch (error) {
        console.log('error:  ' + error);
    }

    return await alfrescoJsApi.content.getContentUrl(zipDemoNode.entry.id, true);
}

async function main() {

    program
        .version('0.1.0')
        .option('-p, --password [type]', 'password')
        .option('-u, --username  [type]', 'username')
        .option('-o, --output  [type]', 'oputput folder')
        .option('--base-href  [type]', '')
        .option('-f, --folder [type]', 'Name of the folder')
        .option('-host, --host [type]', 'URL of the CS')
        .parse(process.argv);

    alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: program.host
    });

    if (!program.output) {
        program.output = 'node_modules'
    }

    alfrescoJsApi.login(program.username, program.password);

    let coreUrl = await getUrl(program.folder, 'core');
    downloadZip(coreUrl, program.output, 'core');

    let contentUrl = await getUrl(program.folder, 'content-services');
    downloadZip(contentUrl, program.output, 'content-services');

    let processUrl = await getUrl(program.folder, 'process-services');
    downloadZip(processUrl, program.output, 'process-services');

    let insightUrl = await getUrl(program.folder, 'insights');
    downloadZip(insightUrl, program.output, 'insights');
}

main();
