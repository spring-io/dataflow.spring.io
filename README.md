<p align="center">
  <a href="https://dataflow.spring.io">
    <img alt="Spring Data Flow Dashboard" title="Spring Data Flow Website" src="https://i.imgur.com/ZcoBGnU.png" width="450">
  </a>
</p>

## Introduction

This is the **Spring Cloud Data Flow Website**, located at [https://dataflow.spring.io](https://dataflow.spring.io).

## Building

You'll need [NodeJS](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/) installed globally.

```bash
# Init
yarn install        # Install dependencies

# Linter
yarn lint           # Linter
yarn fix            # Fix linting errors

# Dev
yarn start          # Run dev

# Prod
yarn build          # Run dev
yarn serve          # Serve the prod build
```

## Configure

### Algolia

```bash
export ALGOLIA_ADMIN_KEY=<KEY>
```

## Documentation

Features:

- Markdown syntax
- Download and embed external files
- Versioning

[Read more](/doc/help)

### Versioning
