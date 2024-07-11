# Action Service

`service`

The Action Service is a service that allows you to subscribe to events and publish events. 

## API

### `dispatch(action: Action): void`

Dispatch an action. This will notify all subscribers of the action.

Example:

```typescript
this.actionService.dispatch({ type: 'MY_ACTION', payload: { foo: 'bar' } });
```

### `ofType(type: string): Observable<Action>`

Subscribe to actions of a specific type.

Example:

```typescript
this.actionService.ofType('MY_ACTION').subscribe(action => {
  console.log(action);
});
```

