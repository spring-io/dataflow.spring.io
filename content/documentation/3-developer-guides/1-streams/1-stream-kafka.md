---
path: 'developer-guides/streams/stream-kafka/'
title: 'Spring Cloud Stream using Apache Kafka'
description: 'Create a simple stream processing application using Apache Kafka'
---

# Stream Processing with Apache Kafka

In this guide we will develop a stream processing application and deploy it to Cloud Foundry, Kubernetes, and on your local machine. In another guide, we will deploy the stream processing application using Data Flow.

We will start from initializr and create two Spring Cloud Stream applications.
Note for CF we need a manifest, for k8s we need a service/deployment yaml.

## Development

Explaine what we are doing to do development wise.

Create a source and a sink. The source can use an @Scheduled annotation that triggers every few seconds and send a simple domain object. The sink can log the incoming payload.

### Initialzr

Go to initializr - maybe have a curl command ready to go do we can just download a ready made .zip.

### Biz Logic

Your biz logic is coded in this section,

### Testing

Show a simple test.

## Deployment

Deploy to local, Cloud Foundry and Kubernetes

### Local

get the jar run it bla

### Cloud Foundry

As Alana I must ask for an org/space

### Kubernetes

Where all the cool kids play.
