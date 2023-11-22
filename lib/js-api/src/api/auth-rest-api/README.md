# **Authentication API**

Provides access to the authentication features of Alfresco Content Services.

> Documentation updated on: 2019-10-17T13:35:27.038+01:00

## Methods

All URIs are relative to:

```text
https://localhost/alfresco/api/-default-/public/authentication/versions/1
```

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
AuthenticationApi | [**createTicket**](docs/AuthenticationApi.md#createTicket) | **POST** /tickets | Create ticket (login)
AuthenticationApi | [**deleteTicket**](docs/AuthenticationApi.md#deleteTicket) | **DELETE** /tickets/-me- | Delete ticket (logout)
AuthenticationApi | [**validateTicket**](docs/AuthenticationApi.md#validateTicket) | **GET** /tickets/-me- | Validate ticket

## Models

- [ErrorError](docs/ErrorError.md)
- [ModelError](docs/ModelError.md)
- [Ticket](docs/Ticket.md)
- [TicketBody](docs/TicketBody.md)
- [TicketEntry](docs/TicketEntry.md)
- [ValidTicket](docs/ValidTicket.md)
- [ValidTicketEntry](docs/ValidTicketEntry.md)
