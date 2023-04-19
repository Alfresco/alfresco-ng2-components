module.exports = async ({github, context, dependencyName, tagVersion = 'alpha' }) => {

    console.log('owner', context.repo.owner)
    const organization = 'alfresco';
    const dependencyFullName = `@${organization}/${dependencyName}`;
    
    console.log('Looking versions for: ', dependencyFullName);
    
    const pjson = require('../../../package.json');
    const currentDependency = pjson?.dependencies[dependencyFullName];
    console.log('current from package.json:', currentDependency);
    
    const { data: availablePakages } = await github.rest.packages.getAllPackageVersionsForPackageOwnedByOrg({
        package_type: 'npm',
        package_name: dependencyName,
        org: organization
    });
    
    let latestPkgToUpdate = undefined;
    if (tagVersion !== 'latest') {
        console.log('alpha: taking most recent')

        const filteredAlphaPkgs = availablePakages.filter( (item) => item.name.match('^[0-9]*.[0-9]*.[0-9]*.-[0-9]*$'));
        latestPkgToUpdate = filteredAlphaPkgs[0];
    } else {
        console.log('release: taking most recent')
        const filteredReleasePkgs = availablePakages.filter( (item) => item.name.match('^[0-9]*.[0-9]*.[0-9]*$'));
        latestPkgToUpdate = filteredReleasePkgs[0];
    }

    if (latestPkgToUpdate === undefined) {
        console.log(`Something went wrong. Not able to find any version.`);
        return { hasVersionNew: 'false' };
    } else {
        console.log(`latest tag:${tagVersion} from NPM: `, latestPkgToUpdate.name);

        if (currentDependency === latestPkgToUpdate?.name) {
            console.log(`There is no new version published for ${dependencyFullName}.`);
            return { hasVersionNew: 'false' };
        } else {
            return { hasVersionNew: 'true', latestVersion: latestPkgToUpdate?.name };
        }
    }

}
    