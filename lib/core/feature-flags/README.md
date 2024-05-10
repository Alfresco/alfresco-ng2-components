# @alfresco/adf-core/feature-flags

Secondary entry point of `@alfresco/adf-core`. It can be used by importing from `@alfresco/adf-core/feature-flags`.

Feature flags (aka feature toggles) are a concept that allow product owners to control the availability of a feature in a particular environment.  A product manager may use feature flags to hide a feature that isn't complete yet, roll out a feature to a select set of end-users in order to gather feedback, or coordinate a feature "go live" with marketing and other departments.  From a developer perspective, feature flags are an important tool that allows them to continually commit their code even if a feature is not complete, thus a proper feature flag capability is essential to a functional continuous delivery model. 

Because this library system is BE/Framework agnostic, it's required to implement the service that manages the retrieval of FeatureFlags and provide it to the AppModule:


```javascript
@NgModule({
    declarations: [AppComponent],
    providers: [
          { provide: OverridableFeaturesServiceToken, useClass: <YourCustomFeaturesService> },
          { provide: FeaturesServiceToken, useExisting: OverridableFeaturesServiceToken },
          { provide: FeaturesServiceConfigToken, useValue: <CustomConfiguration> }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

`<YourCustomFeaturesService>` is a service that implements the `IFeaturesService` interface:

```javascript
interface IFeaturesService<T = FlagChangeset> {
  init(): Observable<T>;
  isOn$(key: string): Observable<boolean>;
  isOff$(key: string): Observable<boolean>;
  getFlags$(): Observable<T>;
  getFlagsSnapshot(): T;
}
```

A `FlagChangeset` is an Object in which keys are Feature Flag names, and values are the current and previous enabled status for that particular flag. The previous status can be null. 

```javascript
interface FlagChangeset {
  [key: string]: {
    current: boolean;
    previous: boolean | null;
  };
}
```

Optionally, is possible to provide a `<CustomConfiguration>` 

```javascript
{
    storageKey?: string;
    helperExposeKeyOnDocument?: string;
}
```

`storageKey`: Local Storage key to save feature flags (default: `'feature-flags'`)
`helperExposeKeyOnDocument`: browser document key to add commands to enable or disable feature flags from the browser console.

