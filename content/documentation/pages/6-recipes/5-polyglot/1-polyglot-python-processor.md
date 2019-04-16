---
path: 'recipes/polyglot/processor'
title: 'Python Stream Processor'
description: 'Python Application as a Data Flow Stream Processor'
---

# Python Stream Processor

## Overview

The example code illustrates how to run a Python script, in the role of a processor within an Data Flow Stream.

**TODO: Describe what the stream and processor are doing**

The source code can be found [here](https://github.com/chrisjs/python-processor).

**TODO provide a .zip file of all the source code**
**TODO: Source code to be moved into data flow samples repo in a directory structure that mimics the dataflow.io directory structure. There is already some content in there to get an idea of the directory structure.**

## Description

The processor uses the [kafka-python](https://github.com/dpkp/kafka-python) library to create consumer and producer connections.

The main loop of execution resides in [python_processor.py](https://github.com/chrisjs/python-processor/blob/master/python_processor.py).
For each message received on the inbound kafka topic, send to the output kafka topic as-is, or if `--reverestring=true` is passed to the processor as part of the stream definition, reverse the string then send to the output.

```python
#!/usr/bin/env python

import os
import sys

from kafka import KafkaConsumer, KafkaProducer
from util.http_status_server import HttpHealthServer
from util.task_args import get_kafka_binder_brokers, get_input_channel, get_output_channel, get_reverse_string

consumer = KafkaConsumer(get_input_channel(), bootstrap_servers=[get_kafka_binder_brokers()])
producer = KafkaProducer(bootstrap_servers=[get_kafka_binder_brokers()])

HttpHealthServer.run_thread()

while True:
    for message in consumer:
        output_message = message.value
        reverse_string = get_reverse_string()

        if reverse_string is not None and reverse_string.lower() == "true":
            output_message = "".join(reversed(message.value))

        producer.send(get_output_channel(), output_message)
```

Helper methods are defined in a utility file called `task_args.py` to aid in extracting common environment and command line values.

An `HTTPServer` implementation runs as a thread responding to Spring Boot path health check endpoints (`/actuator/health`, `/actuator/info`), with a default implementation of always returning HTTP 200. A `Dockerfile` is provided to create the image.

## Build & Usage

TODO: This needs to be moved into this page.

Follow the [README.md](https://github.com/chrisjs/python-processor/blob/master/README.md) file for more details on building and running the example source code.
