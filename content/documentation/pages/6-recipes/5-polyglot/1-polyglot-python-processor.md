---
path: 'recipes/polyglot/processor'
title: 'Python Stream Processor'
description: 'Python/Docker as SCDF Stream Processor'
---

# SCDF Python Stream Processor

[[tip]]
| Example source code: https://github.com/chrisjs/python-processor

## Overview

The example code illustrates how to run a Python script, in the role of a processor within an SCDF stream.

## Description

The processor uses the [kafka-python](https://github.com/dpkp/kafka-python) library to create consumer and producer connections.

The main loop of execution resides in `python_processor.py`. For each message received on the inbound kafka topic, send to the output kafka topic as-is, or if `--reverestring=true` is passed to the processor as part of the stream definition, reverse the string then send to the output.

Helper methods are defined in a utility file called `task_args.py` to aid in extracting common environment and command line values.

An `HTTPServer` implementation runs as a thread responding to Spring Boot path health check endpoints (`/actuator/health`, `/actuator/info`), with a default implementation of always returning HTTP 200. A `Dockerfile` is provided to create the image.

## Build & Usage

Follow the [README.md](https://github.com/chrisjs/python-processor/blob/master/README.md) file for more details on building and running the example source code.
