const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({
    auth: '',
    userAgent: 'myApp v1.2.3',
    baseUrl: 'https://api.github.com',
    log: {
        debug: () => {},
        info: () => {},
        warn: console.warn,
        error: console.error
    },
    request: {
        agent: undefined,
        fetch: undefined,
        timeout: 0
    }
});

async function getPRDetails(owner, repo, pull_number) {
    const { data: files } = await octokit.pulls.listFiles({
        owner,
        repo,
        pull_number
    });

    let filesChanged = files.length;
    let linesChanged = files.reduce((total, file) => total + file.additions + file.deletions, 0);

    let level = 'unknown';
    let packageName = 'unknown';
    let packagesAffected = new Set();
    for (let file of files) {
        if (file.filename.startsWith('lib/core/')) {
            if (file.filename.startsWith('lib/core/auth/')) {
                level = 'extreme';
            }
            level = 'major';
            packageName = 'core';
            packagesAffected.add(packageName);
            break;
        } else if (file.filename.startsWith('lib/extensions/')) {
            level = 'major';
            packageName = 'extensions';
            packagesAffected.add(packageName);

            break;
        } else {
            level = 'minor';
            packagesAffected.add(packageName);
        }
    }

    if (level !== 'major') {
        if (linesChanged > 100) {
            level = 'major';
        } else if (linesChanged > 50) {
            level = 'medium';
        }
    }

    if (level !== 'major') {
        if (filesChanged > 10) {
            level = 'major';
        } else if (filesChanged > 5) {
            level = 'medium';
        }
    }

    return {
        filesChanged,
        linesChanged,
        level: level,
        packagesAffected: Array.from(packagesAffected)
    };
}

async function asyncCall() {
    const organization = 'alfresco';
    const owner = 'Alfresco';
    const repo = 'alfresco-ng2-components';
    const pull_number = '9957';

    const changes = await getPRDetails(owner, repo, pull_number);

    // const { data: availablePakages } = await octokit.rest.packages.getAllPackageVersionsForPackageOwnedByOrg({
    //     package_type: 'npm',
    //     package_name: 'adf-core',
    //     org: organization
    // });

    // // console.log(availablePakages[0])

    // availablePakages.push({
    //     id: 123,
    //     name: '6.0.0-A.3',
    //     metadata: { package_type: 'npm' }
    //   })
    // availablePakages.push({
    //     id: 222,
    //     name: '6.0.1',
    //     metadata: { package_type: 'npm' }
    //   })

    // const filteredReleasePkgs = availablePakages.filter( (item) => item.name.match('^[0-9]*.[0-9]*.[0-9]*.A.[0-9]*$') ||  item.name.match('^[0-9]*.[0-9]*.[0-9]*$') )
    // console.log(filteredReleasePkgs)

    // console.log('alpha')
    // const filteredAlphaPkgs = availablePakages.filter( (item) => item.name.match('^[0-9]*\.[0-9]*\.[0-9]*.A\.[0-9]\.[0-9]*$') )
    // console.log(filteredAlphaPkgs)

    // const { data: info } = await octokit.rest.packages.getPackageForOrganization({
    //     package_type: 'npm',
    //     package_name: 'adf-core',
    //     org: organization
    // });

    // console.log(info)

    // const { data: infos } = await octokit.rest.packages.getPackageVersionForOrganization({
    //     package_type: 'npm',
    //     package_name: 'adf-core',
    //     org: organization,
    //     package_version_id: 85591610
    // });

    // console.log(infos)
}

asyncCall();
