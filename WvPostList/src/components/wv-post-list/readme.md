# wv-post-list



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description | Type     | Default   |
| ----------------- | ------------------- | ----------- | -------- | --------- |
| `currentUser`     | `current-user`      |             | `string` | `"{}"`    |
| `isDebug`         | `is-debug`          |             | `string` | `"false"` |
| `posts`           | `posts`             |             | `string` | `"[]"`    |
| `relatedRecordId` | `related-record-id` |             | `string` | `null`    |
| `relatedRecords`  | `related-records`   |             | `string` | `null`    |
| `siteRootUrl`     | `site-root-url`     |             | `string` | `null`    |


## Dependencies

### Depends on

- [wv-post](../wv-post)
- [wv-add-post](../wv-add-post)

### Graph
```mermaid
graph TD;
  wv-post-list --> wv-post
  wv-post-list --> wv-add-post
  wv-post --> wv-comment
  style wv-post-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
