const fs = require('fs');
// const semver = require('semver');

module.exports = async () => {
    const corePackagePath = 'lib/core/package.json';
    const coreSchematicsPath = 'lib/core/schematics/migrations/collection.json';

    const rawCorePackage = fs.readFileSync(corePackagePath, 'utf8');
    const corePackage = JSON.parse(rawCorePackage);

    const rawCoreSchematics = fs.readFileSync(coreSchematicsPath, 'utf8');
    const coreSchematics = JSON.parse(rawCoreSchematics);

    const coreVersion = corePackage.version;

    const coreMigrations = [
        {
            name: 'move-out-alfresco-api',
            version: '<=7.0.0'
        }
    ];

    coreMigrations.forEach((migration) => {
        coreSchematics['schematics'][migration.name]['version'] = coreVersion;
    });

    console.log('Set migration for', coreVersion);
    console.log('coreSchematics', coreSchematics.schematics);

    fs.writeFileSync(coreSchematicsPath, JSON.stringify(coreSchematics, null, 4));
};
