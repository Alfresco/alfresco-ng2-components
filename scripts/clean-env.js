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

    await deletetSite(this.alfrescoJsApi);
    await emptyTrashCan(this.alfrescoJsApi);
}

async function emptyTrashCan(alfrescoJsApi) {
    let deletedNodes = await alfrescoJsApi.core.nodesApi.getDeletedNodes();

    for (let i = 0; i < deletedNodes.list.entries.length; i++) {

        console.log(deletedNodes.list.entries[i].entry.id);

        await alfrescoJsApi.core.nodesApi.purgeDeletedNode(deletedNodes.list.entries[i].entry.id).then(() => {
            console.log('done');
        }, () => {
            console.log('errror');
        })
    }
}

async function deletetSite(alfrescoJsApi) {
    let listSites = await this.alfrescoJsApi.core.sitesApi.getSites();

    console.log(listSites.list.pagination.totalItems);
    for (let i = 0; i < listSites.list.entries.length; i++) {

        console.log(listSites.list.entries[i].entry.id);

        if (listSites.list.entries[i].entry.id !== 'swsdp') {
            await alfrescoJsApi.core.sitesApi.deleteSite(listSites.list.entries[i].entry.id, {options: {permanent: true}}).then(() => {
                console.log('done');
            }, () => {
                console.log('errror');
            })
        }
    }
}

main();
