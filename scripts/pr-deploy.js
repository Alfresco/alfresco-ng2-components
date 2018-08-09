var program = require('commander');
var request = require('request');

function asyncRequest(option) {
    return new Promise(function (resolve, reject) {
        request(option, function (error, res, body) {
            if (!error && (res.statusCode == 200 || res.statusCode == 201)) {
                resolve(body);
            } else {
                console.log("Error " + JSON.stringify(body));
                reject(error + JSON.stringify(body));
                throw "Error";
            }
        });
    });
}

async function main() {

    program
        .version('0.1.0')
        .option('-n, --name [type]', 'Name to give at the service in rancher')
        .option('-r, --remote [type]', 'Remote environment host adf.lab.com ')
        .option('-e, --env [type]', 'Name to give at the service in rancher')
        .option('-i, --image [type]', 'Docker image to load')
        .option('-s, --server [type]', 'Server RANCHER_SERVER URL')
        .option('-p, --password [type]', 'password RANCHER')
        .option('-u, --username [type]', 'username RANCHER')
        .parse(process.argv);

    auth = 'Basic ' + new Buffer(program.username + ':' + program.password).toString('base64')

    var project = await asyncRequest({
        url: program.server + `/v1/project?name=${program.env}`,
        method: 'GET',
        json: true,
        headers: {
            "content-type": "application/json",
            "accept": "application/json",
            "Authorization": auth
        },
        body: ""
    }).catch((error) => {
        console.log('Project name errror'+ error);
    });

    var stacks = await asyncRequest({
        url: `${program.server}/v2-beta/projects/1a2747/stacks?limit=-1&sort=name`,
        method: 'GET',
        json: true,
        headers: {
            "content-type": "application/json",
            "accept": "application/json",
            "Authorization": auth
        },
        body: ""
    }).catch((error) => {
        console.log('Stacks errror'+ error);
    });

    var stackId = stacks.data[0].id;
    var environmentId = project.data[0].id

    console.log("StackId " + stackId);
    console.log("ID environment " + environmentId);
    console.log("image to Load " + program.image);

    var postData = {
        "scale": 1,
        "assignServiceIpAddress": false,
        "startOnCreate": true,
        "type": "service",
        "stackId": stackId,
        "launchConfig": {
            "instanceTriggeredStop": "stop",
            "kind": "container",
            "networkMode": "managed",
            "privileged": false,
            "publishAllPorts": false,
            "readOnly": false,
            "runInit": false,
            "startOnCreate": true,
            "stdinOpen": true,
            "tty": true,
            "vcpu": 1,
            "drainTimeoutMs": 0,
            "type": "launchConfig",
            "labels": {"io.rancher.container.pull_image": "always"},
            "restartPolicy": {"name": "always"},
            "secrets": [],
            "dataVolumes": [],
            "dataVolumesFrom": [],
            "dns": [],
            "dnsSearch": [],
            "capAdd": [],
            "capDrop": [],
            "devices": [],
            "logConfig": {"driver": "", "config": {}},
            "dataVolumesFromLaunchConfigs": [],
            "imageUuid": program.image,
            "ports": [],
            "blkioWeight": null,
            "cgroupParent": null,
            "count": null,
            "cpuCount": null,
            "cpuPercent": null,
            "cpuPeriod": null,
            "cpuQuota": null,
            "cpuRealtimePeriod": null,
            "cpuRealtimeRuntime": null,
            "cpuSet": null,
            "cpuSetMems": null,
            "cpuShares": null,
            "createIndex": null,
            "created": null,
            "deploymentUnitUuid": null,
            "description": null,
            "diskQuota": null,
            "domainName": null,
            "externalId": null,
            "firstRunning": null,
            "healthInterval": null,
            "healthRetries": null,
            "healthState": null,
            "healthTimeout": null,
            "hostname": null,
            "ioMaximumBandwidth": null,
            "ioMaximumIOps": null,
            "ip": null,
            "ip6": null,
            "ipcMode": null,
            "isolation": null,
            "kernelMemory": null,
            "memory": null,
            "memoryMb": null,
            "memoryReservation": null,
            "memorySwap": null,
            "memorySwappiness": null,
            "milliCpuReservation": null,
            "oomScoreAdj": null,
            "pidMode": null,
            "pidsLimit": null,
            "removed": null,
            "requestedIpAddress": null,
            "shmSize": null,
            "startCount": null,
            "stopSignal": null,
            "stopTimeout": null,
            "user": null,
            "userdata": null,
            "usernsMode": null,
            "uts": null,
            "uuid": null,
            "volumeDriver": null,
            "workingDir": null,
            "networkLaunchConfig": null
        },
        "secondaryLaunchConfigs": [],
        "name": program.name,
        "createIndex": null,
        "created": null,
        "description": null,
        "externalId": null,
        "healthState": null,
        "kind": null,
        "removed": null,
        "selectorContainer": null,
        "selectorLink": null,
        "uuid": null,
        "vip": null,
        "fqdn": null
    };

    var createService = await asyncRequest({
        url: `${program.server}/v2-beta/projects/${environmentId}/service`,
        method: 'POST',
        json: true,
        headers: {
            "content-type": "application/json",
            "accept": "application/json",
            "Authorization": auth
        },
        body: postData,
    }).catch((error) => {
        console.log('Error createService'+ error);
    });

    if (!createService) {
        return;
    }

    console.log("New environment ID " + createService.id);

    var loadBalancer = await asyncRequest({
        url: `${program.server}/v1/projects/${environmentId}/loadbalancerservices`,
        method: 'GET',
        json: true,
        headers: {
            "content-type": "application/json",
            "accept": "application/json",
            "Authorization": auth
        },
        body: postData,
    }).catch((error) => {
        console.log('Error loadBalancer'+ error);
    });

    if (!loadBalancer) {
        return;
    }

    var loadBalancerId = loadBalancer.data[0].id;
    console.log("Load balancer ID " + loadBalancerId);

    var loadBalancerGet = await asyncRequest({
        url: `${program.server}/v2-beta/projects/${environmentId}/loadbalancerservices/${loadBalancerId}`,
        method: 'GET',
        json: true,
        headers: {
            "content-type": "application/json",
            "accept": "application/json",
            "Authorization": auth
        }
    }).catch((error) => {
        console.log('Error get load balancer'+ error);
    });

    //console.log("Load balancer ID " + JSON.stringify(loadBalancerGet.lbConfig.portRules));

    var newRule = {
        "type": "portRule",
        "hostname": program.remote,
        "path": `/${program.name}`,
        "priority": 1,
        "protocol": "http",
        "serviceId": createService.id,
        "sourcePort": 80,
        "targetPort": 80
    };

    loadBalancerGet.lbConfig.portRules.push(newRule);

    var loadBalancerUpdate = await asyncRequest({
        url: `${program.server}/v2-beta/projects/${environmentId}/loadbalancerservices/${loadBalancerId}`,
        method: 'PUT',
        json: true,
        headers: {
            "content-type": "application/json",
            "accept": "application/json",
            "Authorization": auth
        },
        body: loadBalancerGet
    }).catch((error) => {
        console.log('Error Update load balancer'+ error);
    });

}

main();
