---
path: 'recipes/polyglot/processor/'
title: 'Python Stream Processor'
description: 'Python Application as a Data Flow Stream Processor'
---

# Python Stream Processor

The example code illustrates how to run a Python script, in the role of a processor within an Data Flow Stream.

In this guide we will package the Python script as a Docker image and deploy to Kubernetes. Apache Kafka will be used as the messaging middleware. One could also deploy to the `Local` platform.
The docker image will be registered in Data Flow as an application of the type `Processor`.

The recipe creates a text processing, Stream pipeline, that receives text messages over HTTP, delegates the text processing to a Python script registered as Data Flow processor and prints the output in a log. The Python script reverses the input text is the `reverestring` command line argument is set to true or pass the message unchanged otherwise.

The following diagram shows the text-reversing processing pipeline.

![SCDF Python Tasks](images/polyglot-python-processor-architecture.png)

## Development

The source code can be found in the samples GitHub [repository](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-website/recipes/polyglot/polyglot-python-processor) and downloaded as a zipped archive: [polyglot-python-processor.zip](https://github.com/spring-cloud/spring-cloud-dataflow-samples/raw/master/dataflow-website/recipes/polyglot/polyglot-python-processor.zip).

The processor uses the [kafka-python](https://github.com/dpkp/kafka-python) library to create consumer and producer connections.

The main loop of execution resides in [python_processor.py](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/recipes/polyglot/polyglot-python-processor/python_processor.py).
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

For the `python_processor.py` to act as a Data Flow `processor` it needs to be bundled in a docker image and uploaded to `DockerHub`. Following [Dockerfile](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/recipes/polyglot/polyglot-python-processor/Dockerfile) illustrates how to bundle a Python script into docker image:

```docker
FROM springcloud/openjdk:latest

RUN apt-get update && apt-get install --no-install-recommends -y \
    python-pip \
 && rm -rf /var/lib/apt/lists/*

RUN pip install kafka-python

COPY python_processor.py /processor/
COPY util/*.py /processor/util/

ENTRYPOINT ["python", "/processor/python_processor.py", "$@", "--"]
```

The Dockerfile installs the required dependencies, adds the python_processor.py script and utilities (under the `util` folder above) and sets the command entry.

### Build

We will now build the docker image and push it to the DockerHub registry.

Checkout the [sample project](https://github.com/spring-cloud/spring-cloud-dataflow-samples) and navigate to the `polyglot-python-processor` folder:

```bash
git clone https://github.com/spring-cloud/spring-cloud-dataflow-samples
cd ./spring-cloud-dataflow-samples/dataflow-website/recipes/polyglot/polyglot-python-processor/
```

From within the `polyglot-python-processor/`, build and push the polyglot-python-processor Docker image to DockerHub:

```bash
docker build -t springcloud/polyglot-python-processor:0.1 .
docker push springcloud/polyglot-python-processor:0.1
```

<!--TIP-->

Replace `springcloud` with your docker hub prefix.

<!--END_TIP-->

Once published in Docker Hub, the image can be registered in Data Flow and deployed.

## Deployment

Follow the [installation instructions](%currentPath%/installation/kubernetes/) to set up Data Flow on Kubernetes.

Retrieve the Data Flow url from minikube (`minikube service --url scdf-server`) and configure your Data Flow shell:

```bash
dataflow config server --uri <Your Data Flow URL>
```

Import the SCDF app starters and register the `polyglot-python-processor` as `python-processor` of type `processor`.

```bash
app import --uri https://dataflow.spring.io/kafka-docker-latest
app register --type processor --name python-processor --uri springcloud/polyglot-python-processor:0.1
```

The `docker://springcloud/polyglot-python-processor:0.1` is resolved from the [DockerHub repository](https://hub.docker.com/r/springcloud/polyglot-python-processor).

Create Data Flow `text-reversal` Stream.

```
stream create --name text-reversal --definition "http --server.port=32123 | python-processor --reverestring=true  | log"
```

The `http` source listens for incoming http messages on port `32123` and forwards them to the `python-processor`. The processor is configured to reverse the input messages (e.g. `reverestring=true`) and sends them downstream to the `log` sink.

Deploy the stream using the `kubernetes.createNodePort` property to expose the HTTP port to the local host

```
stream deploy text-reversal --properties "deployer.http.kubernetes.createNodePort=32123"
```

Post a message

```
http post --target http://192.168.99.104:32123 --data "hello world"
```

If post is successful you should see a conformation message like this:

```
> POST (text/plain) http://192.168.99.104:32123 hello world
> 202 ACCEPTED
```

Inspect logs for posted message (use `kubectl logs -f <log pod name>`):

```
INFO 1 --- [container-0-C-1] log-sink                                 : dlrow olleh
```

You should see the posted message in reversed order (e.g. `dlrow olleh`).
