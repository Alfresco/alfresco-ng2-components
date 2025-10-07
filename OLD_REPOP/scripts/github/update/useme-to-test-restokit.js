
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
    auth: "",
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


    async function asyncCall() {
        const organization = 'alfresco';

        const { data: availablePakages } = await octokit.rest.packages.getAllPackageVersionsForPackageOwnedByOrg({
            package_type: 'npm',
            package_name: 'adf-core',
            org: organization
        });

        // console.log(availablePakages[0])

        availablePakages.push({
            id: 123,
            name: '6.0.0-A.3',
            metadata: { package_type: 'npm' }
          })
        availablePakages.push({
            id: 222,
            name: '6.0.1',
            metadata: { package_type: 'npm' }
          })

        const filteredReleasePkgs = availablePakages.filter( (item) => item.name.match('^[0-9]*.[0-9]*.[0-9]*.A.[0-9]*$') ||  item.name.match('^[0-9]*.[0-9]*.[0-9]*$') )
        console.log(filteredReleasePkgs)

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