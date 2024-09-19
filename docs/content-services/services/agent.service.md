---
Title: Agent service
Added: v7.0.0-alpha.3
Status: Active
Last reviewed: 2024-07-12
---

# [Agent service](../../../lib/content-services/src/lib/agent/services/agent.service.ts "Defined in agent.service.ts")

Manages agents in Content Services.<br/>

<b>In order to use this service, you need to have the HX Insights Connector (additional ACS module) installed.</b>

## Class members

### Methods

-   **getAgents**(): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AgentPaging`](../../../lib/js-api/src/api/content-rest-api/docs/AgentsApi.md#agentpaging)`>`<br/>
    Gets all agents.
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`AgentPaging`](../../../lib/js-api/src/api/content-rest-api/docs/AgentsApi.md#agentpaging)`>` - AgentPaging object containing the agents.

## Details

See the
[Agents API](../../../lib/js-api/src/api/content-rest-api/docs/AgentsApi.md) for more information about the types returned by [Agent
service](agent.service.md) methods and for the implementation of the REST API the service is
based on.
