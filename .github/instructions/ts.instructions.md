---
applyTo: "**/*.ts"
---

# TypeScript Development Standards

## Type Safety

* Strict Type Checking: Always enable and adhere to strict type checking. This helps catch errors early and improves code quality.
* Prefer Type Inference: Allow TypeScript to infer types when they are obvious from the context. This reduces verbosity while maintaining type safety.
* Avoid `any`: Do not use the `any` type unless absolutely necessary as it bypasses type checking. Prefer `unknown` when a type is uncertain and you need to handle it safely.
* Use strict null checks (no `null` or `undefined` without explicit handling)
* Use type guards and union types for robust type checking
* Check for missing return types in function signatures
* Avoid implicit `any` (untyped function parameters)

## Naming Conventions

* Use PascalCase for types, interfaces, and classes
* Use camelCase for variables, functions, and methods
* Use UPPER_CASE for constants

## Modern TypeScript Patterns

* Use optional chaining (`?.`) and nullish coalescing (`??`)
* Prefer `const` over `let`; never use `var`
* Use arrow functions for callbacks and short functions
* Avoid enums - they generate additional code at compile time, which increases the size of the final file. This can have a negative impact on the loading speed and performance of the app. Prefer union types or literal types instead.
* Avoid unhandled promise rejections (missing .catch() or try/catch)
* Use proper async/await pattern
* Avoid inefficient array operations (e.g., nested .map())
* Use destructuring for object/array access
* Prefer arrow functions

## Angular Best Practices

* Standalone Components: Always use standalone components, directives, and pipes. Avoid using `NgModules` for new features or refactoring existing ones.
* Implicit Standalone: When creating standalone components, you do not need to explicitly set `standalone: true` inside the `@Component`, `@Directive` and `@Pipe` decorators, as it is implied by default.
* Lazy Loading: Implement lazy loading for feature routes to improve initial load times of your application.
* Use Angular Material or other modern UI libraries for consistent styling and UI components.
* Implement proper error handling with RxJS operators (e.g., catchError)
* Verify if newly added functionalities can utilize Angular Signals for fine-grained reactivity, reducing change detection overhead.
* Utilize AOT (Ahead-of-Time) compilation and tree-shaking for efficient, smaller bundle sizes.
* Prefer class binding over `ngClass` and `ngStyle` for better performance.
* Use protected on class members that are only used by a component's template, as it allows for better encapsulation while still being accessible to the template.
* Use readonly for properties that shouldn't change.
* Use `takeUntilDestroyed` & `destroyRef`: The `takeUntilDestroyed` and `destroyRef` have been introduced with Angular 16 and help to reduce boilerplate code related to unsubscribing on the `OnDestroy` hook.
* Organize the order of properties and methods in Angular components for readability and maintainability. Recommended order is:
  1. **Injected services** Whether they are public or private, it's clear they are dependencies of the class.
  2. **Inputs**: Properties that receive data from outside.
  3. **Outputs**: Events that the component can trigger.
  4. **ViewChild/ContentChild**: References to HTML elements.
  5. **Public static properties**: Constants and static members that are accessible to everyone.
  6. **Readonly properties**: Immutable public properties.
  7. **Public properties**: Data and functions available to everyone.
  8. **Private static properties**: Constants and static members that are only accessible within the class.
  9. **Private readonly properties**: Immutable private properties.
  10. **Private properties**: Data and functions used only inside the component.
  11. **Setters and Getters**: Methods for accessing and modifying properties.
  12. **Constructor**: Used to initialize the component.
  13. **Lifecycle Hooks**: Methods that run at specific times in the component’s lifecycle.
  14. **Public methods**: Functions available to everyone.
  15. **Private methods**: Functions used only inside the component.

## Components

* Single Responsibility: Keep components small, focused, and responsible for a single piece of functionality.
* Reactive Forms: Prefer Reactive forms over Template-driven forms for complex forms, validation, and dynamic controls due to their explicit, immutable, and synchronous nature.
* Use Typed Forms: Typed Forms in Angular are a new feature introduced in Angular 14 that provide stronger type checking for reactive forms. They allow developers to define the structure and types of form controls, making it easier to catch errors at compile-time rather than runtime.

## Services

* Single Responsibility: Design services around a single, well-defined responsibility.
* `providedIn: 'root'`: Use the `providedIn: 'root'` option when declaring injectable services to ensure they are singletons and tree-shakable.
* `inject()` Function: Prefer the `inject()` function over constructor injection when injecting dependencies, especially within `provide` functions, `computed` properties, or outside of constructor context.

## Unit testing

* Write unit tests for components, services, and pipes using Jasmine and Karma.
* Test cases should be reasonably groupped based on tested functionality/behaviour using describe blocks.
* Use plain English test names based on the should <expectedBehavior> when <stateUnderTest> pattern as a guideline.
* Use Angular's TestBed for component testing with mocked dependencies
* Avoid Direct Calls to Component Lifecycle Hooks: Instead of directly invoking lifecycle hooks like `ngOnInit()`, use Angular's testing utilities to trigger them naturally. For example, use `fixture.detectChanges()` to trigger change detection, which will automatically call `ngOnInit()` and other lifecycle hooks in the correct order.
* Use fixture.componentRef.setInput() Instead of Direct Input Assignment: When testing components with inputs, use `fixture.componentRef.setInput()` to set input values. This method ensures that Angular's change detection is properly triggered, allowing the component to react to input changes as it would in a real application.
* Use the Provide Mock Store for testing components that rely on NgRx state management. This allows you to mock the store and control the state during tests without needing to set up a full NgRx environment.
* Mock HTTP requests using provideHttpClientTesting
* Import only the minimal required modules
* Avoid NO_ERRORS_SCHEMA and CUSTOM_ELEMENTS_SCHEMA in tests to ensure proper error detection
* Do not verify mocked methods
* Avoid mocking component methods unless necessary; prefer testing actual behavior
* Avoid testing private methods directly; test them through public methods instead
* Avoid testing methods or behaviours of children components; use shallow testing or mock child components instead
* Use the overrideProviders API to replace components, directives, pipes, or services declared deep within the module hierarchy
* Avoid async/await in synchronous unit tests
* Prefer data-automation-id over CSS class when possible
* Do not use toBeDefined() to check if an element is visible.
