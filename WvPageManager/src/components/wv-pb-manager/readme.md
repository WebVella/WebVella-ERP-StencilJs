# wv-pb-manager



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute       | Description | Type     | Default     |
| ------------- | --------------- | ----------- | -------- | ----------- |
| `pageId`      | `page-id`       |             | `string` | `undefined` |
| `recordId`    | `record-id`     |             | `string` | `undefined` |
| `siteRootUrl` | `site-root-url` |             | `string` | `undefined` |


## Dependencies

### Depends on

- [wv-pb-node-container](..\wv-pb-node-container)
- [wv-pb-inspector](..\wv-pb-inspector)
- [wv-pb-tree](..\wv-pb-tree)
- [wv-create-modal](..\wv-create-modal)
- [wv-help-modal](..\wv-help-modal)
- [wv-options-modal](..\wv-options-modal)

### Graph
```mermaid
graph TD;
  wv-pb-manager --> wv-pb-node-container
  wv-pb-manager --> wv-pb-inspector
  wv-pb-manager --> wv-pb-tree
  wv-pb-manager --> wv-create-modal
  wv-pb-manager --> wv-help-modal
  wv-pb-manager --> wv-options-modal
  wv-pb-node-container --> wv-pb-node
  wv-pb-node --> wv-loading-pane
  wv-pb-tree --> wv-pb-tree-node
  wv-pb-tree-node --> wv-pb-tree-node
  wv-help-modal --> wv-show-help
  wv-options-modal --> wv-show-options
  style wv-pb-manager fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
