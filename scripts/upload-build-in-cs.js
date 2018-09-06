var program = require('commander');
var AlfrescoApi = require('alfresco-js-api-node');

var fs = require('fs');
var path = require('path');
var archiver = require('archiver');

writeZipLib = async function (zipFolder) {

    if (!fs.existsSync(zipFolder)) {
        fs.mkdirSync(zipFolder);
    }

    // create a file to stream archive data to.
    let output = fs.createWriteStream(path.join(zipFolder, `demo.zip`));
    let archive = archiver('zip', {
        zlib: {level: 9} // Sets the compression level.
    });

    archive.pipe(output);
    archive.directory(path.join(__dirname, `../demo-shell/dist/`), `demo.zip`);

    return archive.finalize();
};

async function main() {

    program
        .version('0.1.0')
        .option('-p, --password [type]', 'password')
        .option('-u, --username  [type]', 'username')
        .option('-f, --folder [type]', 'Name of the folder')
        .option('-host, --host [type]', 'URL of the CS')
        .parse(process.argv);

    let alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: program.host
    });

    let zipFolder = path.join(__dirname, '../demo-shell/zip/');

    await this.writeZipLib(zipFolder);

    let files = fs.readdirSync(path.join(__dirname, '../demo-shell/zip'));

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
            console.log('Folder already present' );

            folder = await alfrescoJsApi.nodes.getNode('-my-', {
                'relativePath': `Builds/${program.folder}`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });
        }

        for (const fileName of files) {

            let pathFile = path.join(__dirname, '../demo-shell/zip/demo.zip');

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
