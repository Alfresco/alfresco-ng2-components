import nxPlugin from '@nx/eslint-plugin';
import rootConfig from '../../eslint.config.mjs';

export default [
	...rootConfig,
	{
		files: ['**/*.ts', '**/*.js', '**/*.mjs'],
		plugins: {
			'@nx': nxPlugin
		},
		rules: {
			'@nx/enforce-module-boundaries': [
				'error',
				{
					enforceBuildableLibDependency: true,
					allow: [],
					depConstraints: [
						{
							sourceTag: 'scope:insights',
							onlyDependOnLibsWithTags: ['scope:core', 'scope:content-services', 'scope:js-api']
						}
					]
				}
			]
		}
	}
];
