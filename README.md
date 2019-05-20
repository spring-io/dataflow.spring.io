<p align="center">
  <a href="https://dataflow.spring.io">
    <img alt="Spring Data Flow Dashboard" title="Spring Data Flow Website" src="https://i.imgur.com/ZcoBGnU.png" width="450">
  </a>
</p>

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

## Q&A and issue tracking

If you have any feedback, additions, or changes to the documentation or guides, don't hesitate to [add an issue](https://github.com/spring-io/dataflow.spring.io/issues).

## Code of Conduct

This project is governed by the [Spring Code of Conduct](CODE_OF_CONDUCT.adoc). By participating, you are expected to uphold this code of conduct. Please report unacceptable behavior to spring-code-of-conduct@pivotal.io.

## License

The Spring Framework is released under version 2.0 of the [Apache License](https://www.apache.org/licenses/LICENSE-2.0).
