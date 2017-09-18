# User Preferences Service

Stores preferences for components.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Details](#details)

<!-- tocstop -->

<!-- markdown-toc end -->

## Details

The preferences are bound to a particular `prefix` so the application can switch between different profiles on demand.

For example upon login you can set the `prefix` as current username:

```ts
import { UserPreferencesService, AuthenticationService } from 'ng2-alfresco-core';

@Component({...})
class AppComponent {
    constructor(private userPreferences: UserPreferencesService,
                private authService: AuthenticationService) {
    }

    onLoggedIn() {
        this.userPreferences.setStoragePrefix(
            this.authService.getEcmUsername()
        );
    }
}
```

As soon as you assign the storage prefix all settings that you get or set via the `UserPreferencesService` will be saved to dedicated profile.

You can import the service in your controller and use its APIs like below:

```ts
@Component({...})
class AppComponent {
    constructor(userPreferences: UserPreferencesService) {

        userPreferences.set('myProperty1', 'value1');
        userPreferences.set('myProperty2', 'value2');

        console.log(
            userPreferences.get('myProperty1')
        );
    }
}
```

The service also provides quick access to a set of the "known" properties used across ADF components.

Known properties:

- paginationSize (number) - gets or sets the preferred pagination size
