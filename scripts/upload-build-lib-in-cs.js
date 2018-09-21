var program = require('commander');
var AlfrescoApi = require('alfresco-js-api-node');

var fs = require('fs');
var path = require('path');
var archiver = require('archiver');

writeZipLib = async function (zipName, zipFolder) {

    if (!fs.existsSync(zipFolder)) {
        fs.mkdirSync(zipFolder);
    }

    // create a file to stream archive data to.
    let output = fs.createWriteStream(path.join(zipFolder, `${zipName}.zip`));
    let archive = archiver('zip');

    archive.pipe(output);
    archive.directory(path.join(__dirname, `../lib/dist/${zipName}`), zipName);

    return archive.finalize();
};

async function main() {

    program
        .version('0.1.0')
        .usage('[options] <file ...>')
        .option('-p, --password [type]', 'password')
        .option('-u, --username  [type]', 'username')
        .option('-f, --folder [type]', 'Name of the folder')
        .option('-host, --host [type]', 'URL of the CS')
        .parse(process.argv);

    let alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: program.host
    });

    let zipFolder = path.join(__dirname, '/../lib/dist/zip/');

    await this.writeZipLib('core', zipFolder);
    await this.writeZipLib('content-services', zipFolder);
    await this.writeZipLib('process-services', zipFolder);
    await this.writeZipLib('insights', zipFolder);
    await this.writeZipLib('process-services-cloud', zipFolder);

    let files = fs.readdirSync(path.join(__dirname, '../lib/dist/zip'));

    if (files && files.length > 0) {

        alfrescoJsApi.login(program.username, program.password);
        let folder;

        if (!program.folder) {
            program.folder = Date.now();
        }

        try {
            folder = await alfrescoJsApi.nodes.addNode('-my-', {
                'name': program.folder,
                'relativePath': `Builds`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });
        } catch (error) {
            console.log(`Folder Builds/${program.folder} creation error ${JSON.stringify(error)}` );

            folder = await alfrescoJsApi.nodes.getNode('-my-', {
                'relativePath': `Builds/${program.folder}`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });
        }

        for (const fileName of files) {

            let pathFile = path.join(__dirname, '../lib/dist/zip', fileName);

            console.log('Upload  ' + pathFile);
            let file = fs.createReadStream(pathFile);

            try {
                await  alfrescoJsApi.upload.uploadFile(
                    file,
                    '',
                    folder.entry.id,
                    null,
                    {
                        'name': file.name,
                        'nodeType': 'cm:content'
                    });

            } catch (error) {
                console.log('error' + error);
            }
        }
    }
}

main();
