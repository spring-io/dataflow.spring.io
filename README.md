<p align="center">
  <a href="https://dataflow.spring.io">
    <img alt="Spring Data Flow Dashboard" title="Spring Data Flow Website" src="https://i.imgur.com/ZcoBGnU.png" width="450">
  </a>
</p>

## Introduction

This project contains the documentation and guides for the [dataflow.spring.io](https://dataflow.spring.io) site.

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

We welcome contributions! Follow this [link](https://github.com/spring-cloud/spring-cloud-dataflow/blob/master/spring-cloud-dataflow-docs/src/main/asciidoc/appendix-contributing.adoc) for more information on how to contribute.

## Q&A and issue tracking

If you have any feedback, or feature requests, don't hesitate to [add an issue](https://github.com/spring-io/dataflow.spring.io/issues).

## Code of Conduct

This project is governed by the [Spring Code of Conduct](CODE_OF_CONDUCT.adoc). By participating, you are expected to uphold this code of conduct. Please report unacceptable behavior to spring-code-of-conduct@pivotal.io.

## License

The Spring Framework is released under version 2.0 of the [Apache License](https://www.apache.org/licenses/LICENSE-2.0).
