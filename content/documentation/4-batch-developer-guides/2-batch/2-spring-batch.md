---
path: 'batch-developer-guides/batch/spring-batch/'
title: 'Spring Batch Jobs'
description: 'Create a Spring Batch Job'
---

# Batch Processing with Spring Batch

In this guide we will develop a Spring Batch application and deploy it to Cloud Foundry, Kubernetes, and on your local machine. In another guide, we will deploy the Spring Batch application using Data Flow.

We will start from initializr and create a Spring Batch application.
Note for CF we need a manifest, for k8s we need a service/deployment yaml.

## Development

Explaine what we are doing to do development wise.

Create a single step batch job, file item reader, file item writer, no other dependencies outside of spring batch.

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

This section will walk you the billrun application on Kubernetes.

#### Setting up the Kubernetes cluster

For this we need a running [Kubernetes cluster](/documentation/installation/kubernetes/). For this example we will deploy to `minikube`.

##### Verify minikube is up and running:

```bash
$ minikube status

host: Running
kubelet: Running
apiserver: Running
kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.100
```

##### Install the database

We will install a MySQL server, using the default configuration from Spring Cloud Data Flow. Execute the following command:

```bash
$ kubectl apply -f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-deployment.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-pvc.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-secrets.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-svc.yaml
```

##### Build a Docker image for the sample task application

We will build the docker image for the `billrun` app, which is configured with the [jib maven plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin#build-your-image):

```bash
$ eval $(minikube docker-env)
$ ./mvnw clean package jib:dockerBuild
```

This will add the image to the `minikube` Docker registry.
Verify its presence by finding `springcloudtask/billrun` in the list of images:

```bash
$ docker images
```

##### Deploy the app

The simplest way to deploy a batch application is as a standalone [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/).
Deploying batch apps as a [Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) or [CronJob](https://kubernetes.io/docs/tasks/job/) is considered best practice for production environments, but is beyond the scope of this guide.

Save the following to `batch-app.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: billrun
spec:
  restartPolicy: Never
  containers:
    - name: task
      image: springcloudtask/billrun:1.0.0.BUILD-SNAPSHOT
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
$ kubectl apply -f batch-app.yaml
```

When the task is complete, you should see something like this:

```bash
$ kubectl get pods
NAME                     READY   STATUS      RESTARTS   AGE
mysql-5cbb6c49f7-ntg2l   1/1     Running     0          4h
billrun            0/1     Completed   0          81s
```

Delete the Pod.

```bash
$ kubectl delete -f batch-app.yaml
```

Log in to the `mysql` container to query the `BILL_STATEMENTS` table.
Get the name of the `mysql`pod using`kubectl get pods`, as shown above.
Then login:

<!-- Rolling my own to disable erroneous formating -->
<div class="gatsby-highlight" data-language="bash">
<pre class="language-bash"><code>$ kubectl exec -it mysql-5cbb6c49f7-ntg2l -- /bin/bash
# mysql -u root -p$MYSQL_ROOT_PASSWORD
mysql&gt; select * from task.BILL_STATEMENTS;
</code></pre></div>

The output should look something like:

| id  | first_name | last_name | minutes | data_usage | bill_amount |
| --- | ---------- | --------- | ------- | ---------- | ----------- |
| 1   | jane       | doe       | 500     | 1000       | 6.00        |
| 2   | john       | doe       | 550     | 1500       | 7.00        |
| 3   | melissa    | smith     | 600     | 1550       | 7.55        |
| 4   | michael    | smith     | 650     | 1500       | 8.00        |
| 5   | mary       | jones     | 700     | 1500       | 8.50        |

To uninstall `mysql`:

```bash
$ kubectl delete all -l app=mysql
```
