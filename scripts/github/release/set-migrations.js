const fs = require('fs');

const getFile = (path) => {
    const rawFile = fs.readFileSync(path, 'utf8');
    const file = JSON.parse(rawFile);

    return file;
};

module.exports = async () => {
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
            version: '7.0.0'
        }
    ];

    coreMigrations.forEach((migration) => {
        coreMigration['schematics'][migration.name]['version'] = coreVersion;
        coreMigration['packageJsonUpdates'][migration.name]['version'] = coreVersion;
        const packagesToUpdate = coreMigration['packageJsonUpdates'][migration.name]['packages'];

        Object.keys(packagesToUpdate).forEach((packageName) => {
            if (packageName === '@alfresco/js-api') {
                packagesToUpdate[packageName]['version'] = jsApiPackage.version;
            } else {
                packagesToUpdate[packageName]['version'] = coreVersion;
            }
        });
    });

    console.log('Set migration for', coreVersion);
    console.log('coreSchematics', coreMigration.schematics);
    console.log('packageJsonUpdates', JSON.stringify(coreMigration.packageJsonUpdates));

    fs.writeFileSync(coreMigrationConfigPath, JSON.stringify(coreMigration, null, 4));
};
