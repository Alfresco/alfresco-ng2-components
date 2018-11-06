var program = require('commander');
var AlfrescoApi = require('alfresco-js-api-node');
var http = require('http');

var fs = require('fs');
var path = require('path');
var unzip = require('unzip-stream');

var alfrescoJsApi;

unzipRetry = (url, outputFolder, pacakge, tentativeNumber) => {
    console.log(`Unzip  ${pacakge} in ` + path.join(__dirname, `../${pacakge}.zip`));
    fs.createReadStream(path.join(__dirname, `../${pacakge}.zip`))
        .pipe(unzip.Extract({path: path.join(__dirname, `../${outputFolder}/@alfresco/`)}))
        .on('error', (error) => {
            console.log('Error' + error)
            if (tentativeNumber <= 4) {
                fs.unlinkSync(path.join(__dirname, `../${pacakge}.zip`));
                setTimeout(() => {
                    downloadZip(url, outputFolder, pacakge, tentativeNumber);
                }, 10000);
            }
        })
        .on('finish', () => {
            setTimeout(() => {
                let oldFolder = path.join(__dirname, `../${outputFolder}/@alfresco/${pacakge}`)
                let newFolder = path.join(__dirname, `../${outputFolder}/@alfresco/adf-${pacakge}`)

                fs.rename(oldFolder, newFolder, (err) => {
                    console.log('renamed complete');
                });

            }, 10000);
        })
};

downloadZip = async (url, outputFolder, pacakge, tentativeNumber) => {
    if (!tentativeNumber) {
        tentativeNumber = 0;
    }

    tentativeNumber++;

    console.log(`Download ${pacakge} in OutputFolder ${outputFolder}`)

    let file = fs.createWriteStream(`${pacakge}.zip`);
    return await http.get(`http://${url}`, (response) => {
        response.pipe(file);
        file.on('finish', async () => {
            file.close(() => {
                unzipRetry(url, outputFolder, pacakge, tentativeNumber);
            });
        });
    });
};

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
};

async function main() {

    program
        .version('0.1.0')
        .option('-p, --password [type]', 'password')
        .option('-u, --username  [type]', 'username')
        .option('-o, --output  [type]', 'output folder')
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

    await alfrescoJsApi.login(program.username, program.password);

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
