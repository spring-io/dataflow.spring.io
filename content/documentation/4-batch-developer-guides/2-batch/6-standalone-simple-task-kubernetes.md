---
path: 'batch-developer-guides/batch/standalone-simple-task-kubernetes/'
title: 'Deploying a task application on Kubernetes'
description: 'Guide to deploying spring-cloud-stream-task applications on Kubernetes'
---

# Deploying a task application in Kubernetes

This guide will walk you through how to deploy and run a simple [spring-cloud-task](https://spring.io/projects/spring-cloud-task) application on Kubernetes.

We will deploy the sample [billsetuptask]() application to Kubernetes.

## Setting up the Kubernetes cluster

For this we need a running [Kubernetes cluster](/documentation/installation/kubernetes/). Here we will deploy to `minikube`.

### Verify minikube is up and running:

```bash
$ minikube status

host: Running
kubelet: Running
apiserver: Running
kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.100
```

### Install the database

We will install a MySQL server, using the default configuration from Spring Cloud Dataflow. Execute the following commands:

```bash
$ kubectl apply -f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-deployment.yaml

$ kubectl apply -f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-pvc.yaml

$ kubectl apply -f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-secrets.yaml

$ kubectl apply -f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-svc.yaml
```

### Build a Docker image for the sample task application

We will build the `billsetuptask` app, which is configured with the [jib maven plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin#build-your-image):

Clone the task samples git repo, and cd to the `billsetuptask` directory.

```bash
$ eval $(minikube docker-env)
$ mvn clean package jib:dockerBuild
```

This will add the image to the `minikube` Docker registry.
Verify its presence by finding `springcloudtask/billsetuptask` in the list of images:

```bash
$ docker images
```

### Deploy the app

The simplest way to deploy a task application is as a standalone [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/). Deploying tasks as a [Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) or [CronJob](https://kubernetes.io/docs/tasks/job/) is considered best practice for production environments, but is beyond the scope of this guide.

Save the following to `task-app.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: billsetuptask
spec:
  restartPolicy: Never
  containers:
    - name: task
      image: springcloudtask/billsetuptask:1.0.0.BUILD-SNAPSHOT
      env:
        - name: SPRING_DATASOURCE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql
              key: mysql-root-password
        - name: SPRING_DATASOURCE_URL
          value: jdbc:mysql://mysql:3306/task
        - name: SPRING_DATASOURCE_USERNAME
          value: root
        - name: SPRING_DATASOURCE_DRIVER_CLASS_NAME
          value: com.mysql.jdbc.Driver
  initContainers:
    - name: init-mysql-database
      image: mysql:5.6
      env:
        - name: MYSQL_PWD
          valueFrom:
            secretKeyRef:
              name: mysql
              key: mysql-root-password
      command:
        [
          'sh',
          '-c',
          'mysql -h mysql -u root -e "CREATE DATABASE IF NOT EXISTS task;"',
        ]
```

Start the app:

```bash
$ kubectl apply -f task-app.yaml
```

When the task is complete, you should see something like this:

```bash
$ kubectl get pods
NAME                     READY   STATUS      RESTARTS   AGE
mysql-5cbb6c49f7-ntg2l   1/1     Running     0          4h
billsetuptask            0/1     Completed   0          81s
```

Delete the Pod.

```
$ kubectl delete -f task-app.yaml
```

Log in to the `mysql` container to query the `TASK_EXECUTION` table. Get the name of the 'mysql`pod using`kubectl get pods`, as shown above. Then login:

```bash
$ kubectl exec -it mysql-5cbb6c49f7-ntg2l -- /bin/bash

# mysql -u root -p$MYSQL_ROOT_PASSWORD

mysql> select * from task.TASK_EXECUTION;
```
