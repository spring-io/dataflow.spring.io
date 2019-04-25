---
path: 'batch-developer-guides/batch/data-flow-simple-task-kubernetes/'
title: 'Deploying a task application on Kubernetes with Data Flow'
description: 'Guide to deploying spring-cloud-stream-task applications on Kubernetes using Spring Cloud Data Flow'
---

# Deploying a task application in Kubernetes

This guide will walk through how to deploy and run a simple [spring-cloud-task](https://spring.io/projects/spring-cloud-task) application on Kubernetes using Spring Cloud Data Flow.

We will deploy the sample [billsetuptask]() application to Kubernetes.

## Setting up SCDF the Kubernetes cluster

For this we need a running [Kubernetes cluster with Spring Cloud Data Flow deployed](/documentation/installation/kubernetes/). For this example we will use `minikube`.

### Verify Spring Cloud Data Flow is up and running

When SCDF is running on Kubernetes, you should see the `scdf-server` pod in a `Running` state and the associated service created.

```bash
$ kubectl get all -l app=scdf-server
NAME                              READY   STATUS    RESTARTS   AGE
pod/scdf-server-65789665d-79hrz   1/1     Running   0          5m39s

NAME                  TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
service/scdf-server   LoadBalancer   10.109.181.91   <pending>     80:30403/TCP   5m39s

NAME                          READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/scdf-server   1/1     1            1           5m39s

NAME                                    DESIRED   CURRENT   READY   AGE
replicaset.apps/scdf-server-65789665d   1         1         1       5m39s
```

NOTE: On minikube, `EXTRNAL-IP = <pending>` for the `service` is normal.

### Build a Docker image for the sample task application

We will build the `billsetuptask` app, which is configured with the [jib maven plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin#build-your-image):

Clone or download the task samples git repo, and navigate to the `billsetuptask` directory.

```bash
$ eval $(minikube docker-env)
$ ./mvnw clean package jib:dockerBuild
```

This will add the image to the `minikube` Docker registry.
Verify its presence by finding `springcloudtask/billsetuptask` in the list of images:

```bash
$ docker images
```

### Register, Create and Launch the Task using Data Flow

We will use the `Data Flow Dashboard` to set up and launch the `billsetuptask` application.

First we need to get the SCDF Server URL

```bash
$ minikube service --url scdf-server
http://192.168.99.100:30403
```

Follow the instructions to [register and launch a task application using Data Flow](/documentation/batch-developer-guides/batch/data-flow-simple-task), using the docker image we just built to register the application.
