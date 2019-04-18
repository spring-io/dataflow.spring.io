---
path: 'markdown/syntax/'
title: 'Syntax'
description: 'Lorem markdownum madefacta, circumtulit aliis, restabat'
meta_title: 'Syntax description'
meta_description: 'Syntax description'
keywords:
  - markdown
  - syntax
prevNext: false
toc: true
summary: false
---

# Syntax

Lorem ipsum dolor %version% sit amet, **consectetur adipiscing** elit, sed do eiusmod tempor incididunt ut labore et dolore _magna aliqua_. Ut enim ad minim veniam, quis [nostrud exercitation](http://spring.io) ullamco.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

## Basics

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

### Unordered list

- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  - Lorem ipsum dolor sit amet, consectetur adipiscing elit. + Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Lorem ipsum dolor sit amet, consectetur adipiscing elit.

### Ordered list

1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  - Lorem ipsum dolor sit amet, consectetur adipiscing elit. + Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Lorem ipsum dolor sit amet, consectetur adipiscing elit.

### Tables

| Option | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data   | Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. |
| engine | engine to be used for processing templates. Handlebars is the default.                                                                                                                                                                                                                                                                                                                                                                                         |
| ext    | extension to be used for dest files.                                                                                                                                                                                                                                                                                                                                                                                                                           |

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

| Key      | Description                                                               |
| -------- | ------------------------------------------------------------------------- |
| `data`   | path to data files to supply the data that will be passed into templates. |
| `engine` | engine to be used for processing templates. Handlebars is the default.    |
| `ext`    | extension to be used for dest files.                                      |

### Sample code

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

#### Inline code

Lorem ipsum dolor sit amet, `consectetur_adipiscing_elit()` , sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

#### Block code

```bash
$ export DATAFLOW_VERSION=2.0.1.RELEASE
$ export SKIPPER_VERSION=2.0.0.RELEASE
$ docker-compose up
```

```yaml
security:
  oauth2:
    client:
      client-id: app
      client-secret: dataflow
      scope: openid
      access-token-uri: http://localhost:8080/uaa/oauth/token
      user-authorization-uri: http://localhost:8080/uaa/oauth/authorize
    resource:
      user-info-uri: http://localhost:8080/uaa/userinfo
      token-info-uri: http://localhost:8080/uaa/check_token
```

```js
var foo = function(bar) {
  return bar++
}

console.log(foo(5))
```

```java
{/* highlight-range{8-14} */}
@EnableBinding(Sink.class)
public class LoggingSink {

  @StreamListener(Sink.INPUT)
  public void log(String message) {
      System.out.println(message);
  }

  public Launcher(String name, String type, Scheduler scheduler) {
  	this.name = name;
  	this.type = type;
  	this.scheduler = scheduler;
  }

  public Scheduler getScheduler() {
  	return scheduler;
  }

  public void setScheduler(Scheduler scheduler) {
  	this.scheduler = scheduler;
  }
}
```

### Images

[Remark Images](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-images) is used to optimize images.

![Spring Cloud Data Flow Shell](images/shell.png)

### Blockquotes

> Blockquotes can also be nested...

> by using additional greater-than signs right next to each other...

### Callouts

Lorem ipsum dolor sit amet, consectetur:

[[danger]]
| Lorem ipsum dolor sit amet, consectetur adipiscing

[[warning]]
| Lorem ipsum dolor sit amet, consectetur adipiscing

[[note]]
| Lorem ipsum dolor sit amet, consectetur adipiscing

[[success]]
| Lorem ipsum dolor sit amet, consectetur adipiscing

[[tip]]
| Lorem ipsum dolor sit amet, consectetur adipiscing

Callout with a title and paragraphs:

[[note | Title callout sample]]
| Lorem ipsum dolor sit amet, **consectetur adipiscing elit**, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
|
| Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

### Variables

| Name          | Description     | Value         |
| ------------- | --------------- | ------------- |
| `version`     | Current version | %version%     |
| `foo`         | Foo             | %foo%         |
| `bar`         | Bar             | %bar%         |
| `reposamples` | reposamples     | %reposamples% |
| `nested.foo`  | reposamples     | %nested.foo%  |

**Usage:** Lorem [ipsum dolor %foo%](https://spring.io/%foo%) sit amet, consectetur `adipisicing %foo%`, sed **do eiusmod %foo%** tempor.

```html
<div>
  <a href="https://spring.io">%version%</a>
</div>
```

[[tip]]
| Lorem ipsum dolor sit amet, consectetur **%foo%** adipiscing

## Embeded

### Code

#### Local file

Add a file in the folder `/content/files/`.
`embed:../../files/foo.java`

#### External files

`/content/external-files.json` contains a list of files to import.
`embed:../../external-files.json`
After building, the files are located at `/content/files/ext/`

Usage:

`embed:../../files/ext/foo/DataFlowServerApplication.java`
`embed:../../files/ext/foo/LocalDataFlowServerAutoConfiguration.java`

### Youtube video

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.
`youtube:https://www.youtube.com/embed/rvAr0KYXBhk`
Lorem ipsum dolor sit amet, consectetur adipisicing elit, [sed do eiusmod](https://www.youtube.com/embed/rvAr0KYXBhk).
