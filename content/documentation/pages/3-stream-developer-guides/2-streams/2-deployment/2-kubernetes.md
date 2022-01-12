---
path: 'stream-developer-guides/streams/deployment/kubernetes'
title: 'Deploy sample stream applications to Kubernetes'
description: 'Deploy sample stream applications to Kubernetes'
---

# Kubernetes Deployment

If you have configured and built the [sample stream applications](%currentPath%/stream-developer-guides/streams/standalone-stream-sample) to run with one of the supported message brokers, You can run them as stand-alone applications on a Kubernetes cluster.

This section walks you through how to deploy the three Spring Cloud Stream applications on Kubernetes.

## Setting up the Kubernetes Cluster

For this example, we need a running [Kubernetes cluster](%currentPath%/installation/kubernetes/#creating-a-kubernetes-cluster). For this example, we deploy to `minikube`.

### Verifying Minikube is Running

To verify that Minikube is running, run the following command (shown with typical output if Minikube is running):

```bash
$minikube status

host: Running
kubelet: Running
apiserver: Running
kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.100
```

### Building Docker Images

To build Docker images, we use the [Spring Boot Maven plugin](https://docs.spring.io/spring-boot/docs/current/maven-plugin/reference/htmlsingle/#build-image).

If you built the apps from scratch using the Boot Maven plugin, the default configuration should work.

Now you can run the Maven build to create the Docker images in the `minikube` Docker registry. To do so, run the following commands:

```bash
eval $(minikube docker-env)
./mvnw spring-boot:build-image
```

If you downloaded the project source, the project includes a parent pom to let you build all the modules with a single command.
Otherwise, run the build for the source, processor, and sink individually.
You need only run `eval $(minikube docker-env)` once for each terminal session.

<!--TIP-->

If you built from the project source using `-Pkafka` or `-Prabbit`, then the images will contain the corresponding binder dependency. If you want to build the images for a specific message broker, use:

```
./mvnw clean spring-boot:build-image -P<broker>
```

<!--END_TIP-->

<!--TABS-->

<!--Kafka-->

### Installing Apache Kafka

Now we can install the Kafka message broker by using the default configuration from Spring Cloud Data Flow.
To do so, run the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/src/kubernetes/kafka/kafka-deployment.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/src/kubernetes/kafka/kafka-svc.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/src/kubernetes/kafka/kafka-zk-deployment.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/src/kubernetes/kafka/kafka-zk-svc.yaml
```

### Deploying the Stream

To deploy the stream, you must first copy and paste the following YAML and save it to `usage-cost-stream.yaml`:

```YAML
kind: Pod
apiVersion: v1
metadata:
  name: usage-detail-sender
  labels:
    app: usage-cost-stream
spec:
  containers:
    - name: usage-detail-sender
      image: usage-detail-sender:0.0.1-SNAPSHOT
      env:
        - name: SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS
          value: kafka
        - name: SPRING_CLOUD_STREAM_BINDINGS_OUTPUT_DESTINATION
          value: user-details
---
kind: Pod
apiVersion: v1
metadata:
  name: usage-cost-processor
  labels:
    app: usage-cost-stream
spec:
  containers:
    - name: usage-cost-processor
      image: usage-cost-processor:0.0.1-SNAPSHOT
      ports:
        - containerPort: 80
          protocol: TCP
      env:
        - name: SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS
          value: kafka
        - name: SPRING_CLOUD_STREAM_BINDINGS_INPUT_GROUP
          value: usage-cost-stream
        - name: SPRING_CLOUD_STREAM_BINDINGS_INPUT_DESTINATION
          value: user-details
        - name: SPRING_CLOUD_STREAM_BINDINGS_OUTPUT_DESTINATION
          value: user-cost
---
kind: Pod
apiVersion: v1
metadata:
  name: usage-cost-logger
  labels:
    app: usage-cost-stream
spec:
  containers:
    - name: usage-cost-logger
      image: usage-cost-logger:0.0.1-SNAPSHOT
      env:
        - name: SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS
          value: kafka
        - name: SPRING_CLOUD_STREAM_BINDINGS_INPUT_GROUP
          value: usage-cost-stream
        - name: SPRING_CLOUD_STREAM_BINDINGS_INPUT_DESTINATION
          value: user-cost
```

Then you need to deploy the apps, by running the following command:

```bash
kubectl apply -f usage-cost-stream.yaml
```

If all is well, you should see the following output:

```
pod/usage-detail-sender created
pod/usage-cost-processor created
pod/usage-cost-logger created
```

The preceding YAML specifies three pod resources, for the source, processor, and sink applications.
Each pod has a single container that references the corresponding docker image.

We set the Kafka binding parameters as environment variables.
The input and output destination names have to be correct to wire the stream. Specifically, the output of the source must be the same as the input of the processor, and the output of the processor must be the same as the input of the sink.
We also set the logical hostname for the Kafka broker so that each application can connect to it.
Here we use the Kafka service name &#151; `kafka-broker`, in this case.
We set the `app: user-cost-stream` label to logically group our apps.

We set the Spring Cloud Stream binding parameters by using environment variables.
The input and output destination names have to be correct to wire the stream. Specifically, the output of the source must be the same as the input of the processor, and the output of the processor must be the same as the input of the sink. We set the inputs and outputs as follows:

- Usage Detail Sender: `SPRING_CLOUD_STREAM_BINDINGS_OUTPUT_DESTINATION=user-details`
- Usage Cost Processor: `SPRING_CLOUD_STREAM_BINDINGS_INPUT_DESTINATION=user-details` and `SPRING_CLOUD_STREAM_BINDINGS_OUTPUT_DESTINATION=user-cost`
- Usage Cost Logger: `SPRING_CLOUD_STREAM_BINDINGS_INPUT_DESTINATION=user-cost`

<!--RabbitMQ-->

### Installing RabbitMQ

You can install the RabbitMQ message broker by using the default configuration from Spring Cloud Data Flow.
To do so, run the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/src/kubernetes/rabbitmq/rabbitmq-deployment.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/src/kubernetes/rabbitmq/rabbitmq-svc.yaml
```

### Deploying the Stream

To deploy the stream, you must first copy and paste the following YAML content and save it to `usage-cost-stream.yaml`:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: usage-detail-sender
  labels:
    app: usage-cost-stream
spec:
  containers:
    - name: usage-detail-sender
      image: usage-detail-sender:0.0.1-SNAPSHOT
      env:
        - name: SPRING_RABBITMQ_ADDRESSES
          value: rabbitmq

---
kind: Pod
apiVersion: v1
metadata:
  name: usage-cost-processor
  labels:
    app: usage-cost-stream
spec:
  containers:
    - name: usage-cost-processor
      image: usage-cost-processor:0.0.1-SNAPSHOT
      env:
        - name: SPRING_RABBITMQ_ADDRESSES
          value: rabbitmq
---
kind: Pod
apiVersion: v1
metadata:
  name: usage-cost-logger
  labels:
    app: usage-cost-stream
spec:
  containers:
    - name: usage-cost-logger
      image: usage-cost-logger:0.0.1-SNAPSHOT
      env:
        - name: SPRING_RABBITMQ_ADDRESSES
          value: rabbitmq
```

Then you can deploy the apps, as follows:

```bash
kubectl apply -f usage-cost-stream.yaml
```

If all is well, you should see the following output:

```
pod/usage-detail-sender created
pod/usage-cost-processor created
pod/usage-cost-logger created
```

The preceding YAML specifies three pod resources, for the source, processor, and sink applications. Each pod has a single container that references the respective docker image.

We set the logical hostname for the RabbitMQ broker for each app to connect to it. Here we use the RabbitMQ service name (`rabbitmq` in this case). We also set the label `app: user-cost-stream` to logically group our apps.

<!--END_TABS-->

### Verifying the Deployment

To verify the deployment, use the following command to tail the log for the `usage-cost-logger` sink:

```bash
kubectl logs -f usage-cost-logger
```

You should see messages similar to the following streaming:

```bash
2021-03-05 17:40:52.280  INFO 1 --- [fOjmHePqc5VWA-1] i.s.d.s.u.UsageCostLogger     : {"userId": "user5", "callCost": "28.1", "dataCost": "7.3500000000000005" }
2021-03-05 17:40:53.279  INFO 1 --- [fOjmHePqc5VWA-1] i.s.d.s.u.UsageCostLogger     : {"userId": "user2", "callCost": "21.400000000000002", "dataCost": "22.900000000000002" }
2021-03-05 17:40:54.279  INFO 1 --- [fOjmHePqc5VWA-1] i.s.d.s.u.UsageCostLogger     : {"userId": "user3", "callCost": "0.7000000000000001", "dataCost": "26.35" }
2021-03-05 17:40:55.281  INFO 1 --- [fOjmHePqc5VWA-1] i.s.d.s.u.UsageCostLogger     : {"userId": "user5", "callCost": "17.5", "dataCost": "25.8" }
2021-03-05 17:40:56.286  INFO 1 --- [fOjmHePqc5VWA-1] i.s.d.s.u.UsageCostLogger     : {"userId": "user3", "callCost": "25.3", "dataCost": "3.0" }
2021-03-05 17:40:57.289  INFO 1 --- [fOjmHePqc5VWA-1] i.s.d.s.u.UsageCostLogger     : {"userId": "user4", "callCost": "6.300000000000001", "dataCost": "19.700000000000003" }
2021-03-05 17:40:58.290  INFO 1 --- [fOjmHePqc5VWA-1] i.s.d.s.u.UsageCostLogger     : {"userId": "user4", "callCost": "1.4000000000000001", "dataCost": "19.6" }

```

### Clean Up

To delete the stream, we can use the label we created earlier, as follows:

```bash
kubectl delete pod -l app=usage-cost-stream
```

or

```bash
kubectl delete -f usage-cost-stream.yaml
```

To uninstall RabbitMQ, run the following command:

```bash
kubectl delete all -l app=rabbitmq
```

To uninstall Kafka, run the following command:

```bash
kubectl delete all -l app=kafka
```
