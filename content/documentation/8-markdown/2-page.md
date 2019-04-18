---
path: 'markdown/page/'
title: 'Page'
description: 'Lorem markdownum madefacta, circumtulit aliis, restabat'
keywords:
  - markdown
  - pages
prevNext: false
---

# Page

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Markdown header

Parameters:

| Key                | type      | Required | Description                                                        |
| ------------------ | --------- | :------: | ------------------------------------------------------------------ |
| `path`             | `string`  |    ✅    | Relative path to the resource, should be unique and end with a `/` |
| `title`            | `string`  |    ✅    | Page title                                                         |
| `description`      | `string`  |    ✅    | Page description (used in the summary page)                        |
| `meta_title`       | `string`  |    ❌    | Metadata title                                                     |
| `meta_description` | `string`  |    ❌    | Metadata description                                               |
| `keywords`         | `string`  |    ❌    | Metadata keywords                                                  |
| `summary`          | `boolean` |    ❌    | After the content, display the summary with all the children.      |
| `prevNext`         | boolean   |    ❌    | Set `false` to disabled previous/next links                        |
| `toc`              | boolean   |    ❌    | Set `false` to disabled toc.                                       |

Page **summary** sample:

```md
---
path: 'get-started/'
title: 'Get started'
description: 'Get started with Spring Cloud Data Flow'
meta_title: 'Get Started'
meta_description: 'Spring Cloud Data Flow Get Started'
keywords:
  - started
summary: true
---
```

Page **content** sample:

```md
---
path: 'get-started/local/'
title: 'Local server'
description: 'Get started with local server'
meta_title: 'Get started with local server'
meta_description: 'Spring Cloud Data Flow Get Started local server'
keywords:
  - started
  - local
---
```

## TOC

The TOC is apply only:

- the `toc` attribute is not set to `false`,
- the `summary` attribute is not set to `true`,
- there is at least one title (h2, h3, h4, h5, ...) in the MD file.
