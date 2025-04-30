<p align="center">
  <a href="https://dataflow.spring.io">
    <img alt="Spring Data Flow Dashboard" title="Spring Data Flow Website" src="https://i.imgur.com/ZcoBGnU.png" width="450">
  </a>
</p>

# Dataflow.spring.io is no longer maintained as an open-source project by Broadcom, Inc.

## For information about extended support or commercial options for Spring Cloud Data Flow, please read the official blog post [here](https://spring.io/blog/2025/04/21/spring-cloud-data-flow-commercial).

## Introduction

This project contains the Markdown files that get automatically generated as documentation and guides for the [Spring Cloud Data Flow Microsite](https://dataflow.spring.io/) site.

## Building

You'll need [NodeJS](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/) installed globally. Note that, for Node, you need `version 10`, not the latest version.

```bash
# Init
yarn install        # Install dependencies

# Linter / Prettier
yarn run lint       # Linter
yarn run fix        # Fix linting errors

# Dev
yarn start          # Run dev

# Prod
yarn build          # Run dev
yarn serve          # Serve the prod build
```

## Contributing

We welcome contributions!

All documentation for this project is written using `Markdown`.
An example segment from our [Stream Processing Getting Started Guide](https://dataflow.spring.io/docs/stream-developer-guides/getting-started/stream/) is shown below:

```markdown
# Getting Started with Stream Processing

Spring Cloud Data Flow provides over 70 prebuilt streaming applications that you can use right away to implement common streaming use cases.
In this guide we will use two of these applications to construct a simple data pipeline that produces data sent from an external http request and consumes that data by logging the payload to the terminal.

Instructions for registering these prebuilt applications with Data Flow are provided in the [Installation guide](%currentPath%/installation/).
```

All commits must include a **Signed-off-by** trailer at the end of each commit message to indicate that the contributor agrees to the Developer Certificate of Origin.
For additional details, please refer to the blog post https://spring.io/blog/2025/01/06/hello-dco-goodbye-cla-simplifying-contributions-to-spring[Hello DCO, Goodbye CLA: Simplifying Contributions to Spring].

## Q&A and issue tracking

If you have any feedback, additions, or changes to the documentation or guides, don't hesitate to [add an issue](https://github.com/spring-io/dataflow.spring.io/issues).

## License

The Spring Framework is released under version 2.0 of the [Apache License](https://www.apache.org/licenses/LICENSE-2.0).
