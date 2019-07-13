# wv-pb-node-container



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute        | Description | Type     | Default |
| -------------- | ---------------- | ----------- | -------- | ------- |
| `containerId`  | `container-id`   |             | `string` | `null`  |
| `parentNodeId` | `parent-node-id` |             | `string` | `null`  |


## Dependencies

### Used by

 - [wv-pb-manager](..\wv-pb-manager)

### Depends on

- [wv-pb-node](..\wv-pb-node)

### Graph
```mermaid
graph TD;
  wv-pb-node-container --> wv-pb-node
  wv-pb-node --> wv-loading-pane
  wv-pb-manager --> wv-pb-node-container
  style wv-pb-node-container fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
