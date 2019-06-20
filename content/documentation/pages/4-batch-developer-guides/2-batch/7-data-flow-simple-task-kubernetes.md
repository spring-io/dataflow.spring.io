---
path: 'batch-developer-guides/batch/data-flow-simple-task-kubernetes/'
title: 'Deploying a task application on Kubernetes with Data Flow'
description: 'Guide to deploying spring-cloud-stream-task applications on Kubernetes using Spring Cloud Data Flow'
---

# Deploying a Task Application in Kubernetes

This guide walks through how to deploy and run a simple [spring-cloud-task](https://spring.io/projects/spring-cloud-task) application on Kubernetes by using Spring Cloud Data Flow.

We deploy the sample [billsetuptask](%currentPath%/batch-developer-guides/batch/spring-task) application to Kubernetes.

## Setting up SCDF the Kubernetes Cluster

For this, we need a running [Kubernetes cluster with Spring Cloud Data Flow deployed](%currentPath%/installation/kubernetes/). For this example, we use `minikube`.

### Verifying that Spring Cloud Data Flow is Running

When SCDF is running on Kubernetes, you should see the `scdf-server` pod in a `Running` state and the associated service created.
You can use the following command (shown with typical output) to see the `scdf-server`:

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

NOTE: On Minikube, `EXTRNAL-IP = <pending>` for the `service` is normal.

### Building a Docker Image for the Sample Task Application

We build the `billsetuptask` app, which is configured with the [jib maven plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin#build-your-image). To do so:

1. Clone or download the task samples git repo and navigate to the `billsetuptask` directory.

1. Run the following commands to build the docker image:

   ```bash
   $ eval $(minikube docker-env)
   $ ./mvnw clean package jib:dockerBuild
   ```

   Those commands add the image to the `minikube` Docker registry.

1. Verify its presence by finding `springcloudtask/billsetuptask` in the list of images provided by running the following command:
   ```bash
   $ docker images
   ```

### Registering, Creating, and Launching the Task by Using Data Flow

We use the `Data Flow Dashboard` to set up and launch the `billsetuptask` application.

First, we need to get the SCDF Server URL, which we can do with the following command (the listing includes the output):

```bash
$ minikube service --url scdf-server
http://192.168.99.100:30403
```

Now you can follow the instructions to [register and launch a task application using Data Flow](%currentPath%/batch-developer-guides/batch/data-flow-simple-task), using the docker image we just built to register the application.
