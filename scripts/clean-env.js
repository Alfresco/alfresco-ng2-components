let alfrescoApi = require('@alfresco/js-api');
let program = require('commander');

async function main() {

    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host adf.lab.com ')
        .option('-p, --password [type]', 'password RANCHER')
        .option('-u, --username [type]', 'username RANCHER')
        .parse(process.argv);

    this.alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: program.host
    });

    await this.alfrescoJsApi.login(program.username, program.password);

    await cleanRoot(this.alfrescoJsApi);
    await deleteSite(this.alfrescoJsApi);
    await emptyTrashCan(this.alfrescoJsApi);
}

async function cleanRoot(alfrescoJsApi) {
    console.log('====== Clean Root ======');

    let rootNodes = await alfrescoJsApi.core.nodesApi.getNodeChildren('-root-', {
        include: ['properties']
    });

    for (let i = 0; i < rootNodes.list.entries.length; i++) {

        sleep(200);

        if(rootNodes.list.entries[i].entry.createdByUser.id !== 'System') {

            try {
                await alfrescoJsApi.core.nodesApi.deleteNode(rootNodes.list.entries[i].entry.id);
            } catch (error) {
                console.log('error' + JSON.stringify(error));

            }
        }
    }
}

async function emptyTrashCan(alfrescoJsApi) {
    console.log('====== Clean Trash ======');

    let deletedNodes = await alfrescoJsApi.core.nodesApi.getDeletedNodes();

    for (let i = 0; i < deletedNodes.list.entries.length; i++) {

        sleep(200);

        console.log(deletedNodes.list.entries[i].entry.id);

        try {
            await alfrescoJsApi.core.nodesApi.purgeDeletedNode(deletedNodes.list.entries[i].entry.id);
        } catch (error) {
            console.log('error' + JSON.stringify(error));
        }
    }

    emptyTrashCan(alfrescoJsApi);
}

async function deleteSite(alfrescoJsApi) {
    console.log('====== Clean Sites ======');

    let listSites = await this.alfrescoJsApi.core.sitesApi.getSites();

    console.log(listSites.list.pagination.totalItems);
    for (let i = 0; i < listSites.list.entries.length; i++) {

        sleep(200);

        console.log(listSites.list.entries[i].entry.id);

        if (listSites.list.entries[i].entry.id !== 'swsdp') {
            try {
                await alfrescoJsApi.core.sitesApi.deleteSite(listSites.list.entries[i].entry.id, {options: {permanent: true}});
            } catch (error) {
                console.log('error' + JSON.stringify(error));

            }
        }
    }

    deleteSite(alfrescoJsApi);
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay) ;
}

main();
