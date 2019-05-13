---
path: 'concepts/tooling/'
title: 'Tooling'
description: 'Dashboard and Shell'
---

# Tooling

The Dashboard and Shell are the main ways you interact with Data Flow.
You can also hit the Web API using curl or write an applications that uses the Java client library which in turn calls the Web API.
The next section introduces the features of the Dashboard and the Shell.

## Dashboard

Spring Cloud Data Flow provides a browser-based GUI called the dashboard that organizes the features in Data Flow in several tabs on the left hand site.

- **Apps**: Lists all registered applications and provides the controls to register new applications or unregister existing applications.
- **Runtime**: Provides the list of all running applications.
- **Streams**: Lets you list, design, create, deploy, and destroy Stream Definitions.
- **Tasks**: Lets you list, create, launch, schedule and, destroy Task Definitions.
- **Jobs**: The Jobs tab lets you view detailed Spring Batch Job execution history and to restart a Job execution.
- **Audit Records**: Access to recorded audit events.
- **About**: Provides release information for use in support calls and links to documentation and the Data Flow Shell download.

![Data Flow Dashboard About Tag](images/ui-about-tab.png)

## Shell

The shell can be used an alternative to the Dashboard to interact with Data Flow.
The shell has commands that can be perform most of the same tasks as listed before in the Dashboard section, the listing of Audit Records being the one exception.

It supports tab completion for commands and also for Stream/Batch DSL definitions. There are command line options for connecting the shell to the Data Flow Server.

You can get a listing of commands by typing `help` and then help for each individual command by typing `help <command>`
A partial listing of commands is shown below

![Data Flow Shell](images/shell-help.png)

## Web API

Data Flow's Web API tries to adhere as closely as possible to standard HTTP and REST conventions in its use of HTTP verbs.
For example, a `GET` verb is used to retrieve a resource and `POST` to create a new resource.  
Both the Dashboard and the UI are consumers of this API.

Data Flow uses hypermedia, and resources include links to other resources in their responses. Responses are in the Hypertext Application from resource to resource Language - [HAL](http://stateless.co/hal_specification.html). Links can be found beneath the `_links` key. Users of the API should not create URIs themselves. Instead. they should use the above-described links to navigate.

## Java Client

**TODO**
