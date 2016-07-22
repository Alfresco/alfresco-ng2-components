'use strict';

// wsrv extension that provides dynamic '/versions' route

exports.register = function (server, options, next) {

    var packages = [
        'ng2-activiti-form',
        'ng2-alfresco-core',
        'ng2-alfresco-datatable',
        'ng2-alfresco-documentlist',
        'ng2-alfresco-login',
        'ng2-alfresco-search',
        'ng2-alfresco-upload',
        'ng2-alfresco-viewer',
        'ng2-alfresco-webscript'
    ];

    server.route({
        method: 'GET',
        path: '/versions',
        handler: function (request, reply) {
            var result = {
                packages: packages.map(function (packageName) {
                    return {
                        name: packageName,
                        version: require('./../node_modules/' + packageName + '/package.json').version
                    }
                })
            };

            return reply(result).type('application/json');
        }
    });

    next();
};

exports.register.attributes = {
    name: 'ng2-module-versions',
    version: '1.0.0'
};
