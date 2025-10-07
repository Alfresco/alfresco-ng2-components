const fs = require('fs');
const semver = require('semver');

const getFile = (path) => {
    const rawFile = fs.readFileSync(path, 'utf8');
    const file = JSON.parse(rawFile);

    return file;
};

const setMigration = () => {
    const corePackagePath = 'lib/core/package.json';
    const jaApiConfigPackagePath = 'lib/js-api/package.json';
    const coreMigrationConfigPath = 'lib/core/schematics/migrations/collection.json';

    const corePackage = getFile(corePackagePath);
    const coreMigration = getFile(coreMigrationConfigPath);
    const jsApiPackage = getFile(jaApiConfigPackagePath);

    const coreVersion = corePackage.version;

    const coreMigrations = [
        {
            name: 'move-out-alfresco-api',
            allowedVersionScope: '<=7.0.0'
        }
    ];

    console.log(`Core version is ${coreVersion}`);

    coreMigrations.forEach((migration) => {
        const isCoreVersionValid = semver.satisfies(semver.coerce(coreVersion), migration.allowedVersionScope);

        console.log(`Allowed scope for '${migration.name}' is ${migration.allowedVersionScope}`);
        console.log(`${coreVersion} is ${isCoreVersionValid ? 'VALID' : 'NOT VALID'} for ${migration.name}`);

        if (!isCoreVersionValid) {
            console.log(`Skipping migration for ${migration.name}`);
            return;
        }

        coreMigration['schematics'][migration.name]['version'] = coreVersion;

        const packageJsonUpdates = coreMigration['packageJsonUpdates'];

        if (packageJsonUpdates) {
            packageJsonUpdates[migration.name]['version'] = coreVersion;
            const packagesToUpdate = packageJsonUpdates[migration.name]['packages'];

            Object.keys(packagesToUpdate).forEach((packageName) => {
                if (packageName === '@alfresco/js-api') {
                    packagesToUpdate[packageName]['version'] = jsApiPackage.version;
                } else {
                    packagesToUpdate[packageName]['version'] = coreVersion;
                }
            });
        }
    });

    console.log('\nmigrations:', JSON.stringify(coreMigration, null, 2));

    fs.writeFileSync(coreMigrationConfigPath, JSON.stringify(coreMigration, null, 2));
};

module.exports = setMigration;
