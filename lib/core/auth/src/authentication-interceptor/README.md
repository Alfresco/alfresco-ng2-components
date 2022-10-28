# AuthenticationInterceptor

This interceptor is responsible for providing authentication to angular HttpClient requests when a context `SHOULD_ADD_AUTH_TOKEN` is set to true.
By default, the interceptor won't do anything to the intercepted request.

## Usage

```typescript
import { SHOULD_ADD_AUTH_TOKEN } from '@alfresco/adf-core/auth';
import { HttpClient, HttpContext } from '@angular/common/http';

getSth() {
    return this.httpClient.get('http://example.com', { context: new HttpContext().set(SHOULD_ADD_AUTH_TOKEN, true)});
}

// or

getSth() {
    const someRequest = this.httpClient.get('GET', 'http://example.com');
    someRequest.context.set(SHOULD_ADD_AUTH_TOKEN, true);

    return someRequest;
}

```        
