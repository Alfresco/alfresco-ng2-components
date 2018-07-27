import path = require('path');

export class NodeActions {

    lockNode(alfrescoJsApi, nodeId: string, allowOwner?: string) {

        return alfrescoJsApi.nodes.lockNode(nodeId, {
            'type': allowOwner ? 'ALLOW_OWNER_CHANGES' : 'FULL',
            'lifetime': 'PERSISTENT'
        });
    }

}
