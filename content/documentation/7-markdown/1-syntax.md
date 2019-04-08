---
path: "/documentation/markdown/syntax/"
title: "Syntax"
description: Lorem markdownum madefacta, circumtulit aliis, restabat
keywords:
    - markdown
    - syntax
prevNext: false
---

# Syntax

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do eiusmod tempor incididunt ut labore et dolore _magna aliqua_. Ut enim ad minim veniam, quis [nostrud exercitation](http://spring.io) ullamco.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

## Basics

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

### Unordered list

+ Lorem ipsum dolor sit amet, consectetur adipiscing elit.
+ Lorem ipsum dolor sit amet, consectetur adipiscing elit.
+ Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  + Lorem ipsum dolor sit amet, consectetur adipiscing elit.
+ Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  + Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    + Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    + Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  + Lorem ipsum dolor sit amet, consectetur adipiscing elit.
	+ Lorem ipsum dolor sit amet, consectetur adipiscing elit.
+ Lorem ipsum dolor sit amet, consectetur adipiscing elit.

### Ordered list

1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
+ Lorem ipsum dolor sit amet, consectetur adipiscing elit.
+ Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
+ Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    + Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  + Lorem ipsum dolor sit amet, consectetur adipiscing elit.
	+ Lorem ipsum dolor sit amet, consectetur adipiscing elit.
+ Lorem ipsum dolor sit amet, consectetur adipiscing elit.

### Tables

| Option | Description |
| ------ | ----------- |
| data   | Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

| Key | Description |
| ----| ------------|
| `data`| path to data files to supply the data that will be passed into templates. |
| `engine`| engine to be used for processing templates. Handlebars is the default. |
| `ext`| extension to be used for dest files. |

### Sample code

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

#### Inline code

Lorem ipsum dolor sit amet,  `consectetur_adipiscing_elit()` , sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

#### Block code

``` bash
$ export DATAFLOW_VERSION=2.0.1.RELEASE
$ export SKIPPER_VERSION=2.0.0.RELEASE
$ docker-compose up
```

``` yaml
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

``` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```

``` java
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

Lorem ipsum dolor sit amet elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Blockquotes

> Blockquotes can also be nested...

> by using additional greater-than signs right next to each other...

## Advanced components

### Buttons

Lorem ipsum dolor sit amet elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<button variant="primary" path="http://www.spring.io">View the guide</button>

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<button variant="github" path="http://www.spring.io">View the example on **Github**</button>

### Callouts

Lorem ipsum dolor sit amet, consectetur:

<callout variant="danger">Lorem ipsum dolor sit amet, consectetur adipiscing</callout>

<callout variant="warning">Lorem ipsum dolor sit amet, consectetur adipiscing</callout>

<callout>Lorem ipsum dolor sit amet, consectetur adipiscing</callout>

<callout variant="success">Lorem ipsum dolor sit amet, consectetur adipiscing</callout>

<callout variant="tip">Lorem ipsum dolor sit amet, consectetur adipiscing</callout>

Callout with paragraph:

<callout variant="note">
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.

</callout>
