---
path: 'installation/kubernetes/carvel'
title: 'Carvel'
description: 'Installation using Carvel'
---

## Carvel Installation

Spring Cloud Data Flow offers a Carvel Package for deploying the Spring Cloud Data Flow server and Skipper to a Kubernetes Cluster.


The steps are:
* Prepare the cluster for deployment by installing the Carvel components required.
* Creating a namespace and adding the carvel package to the namespace.
* Creating a values file with database and broker properties.
* Optionally you can use provided scripts for deploying a broker, database and prometheus. These scripts will update the values file with the correct credentials.
* Deploy the Spring Cloud Data Flow carvel package. 

For local minikube or kind cluster you can use: [Configure Kubernetes for local development or testing](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#local-k8s-development), and follow the instructions until the section _Deploy Spring Cloud Data Flow_

Detail instructions on the Carvel deployment can be found in the [Reference Guide](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#configuration-carvel).  

## Example Values file

```yaml
scdf:
  binder:
    type: kafka
    kafka:
      broker:
        # Note service-name.namespace as hostname.
        host: kafka-broker.kafka
      zk:
        host: kafka-zk.kafka
  server:
    service:
      type: LoadBalancer
    env:
      # set values to false to disable features
      - name: SPRING_CLOUD_DATAFLOW_FEATURES_STREAMS_ENABLED
        value: "true"
      - name: SPRING_CLOUD_DATAFLOW_FEATURES_TASKS_ENABLED
        value: "true"
      - name: SPRING_CLOUD_DATAFLOW_FEATURES_SCHEDULES_ENABLED
        value: "true"
    database:
      # Note service-name.namespace as hostname.
      url: jdbc:mariadb://mariadb.mariadb/dataflow
      driverClassName: org.mariadb.jdbc.Driver
      # You are encouraged to store credentials in kubernetes secrets. secretgen-controller provides for exporting/importing secrets from one namespace.
      secretName: mariadb
      secretUsernameKey: database-username
      secretPasswordKey: database-password
    metrics:
      dashboard:
        url: http://gafana-host:3000
    image: # provide tag when using version other than the package specific version
      tag: 2.10.3
  skipper:
    database:
      url: jdbc:mariadb://mariadb.mariadb/dataflow
      driverClassName: org.mariadb.jdbc.Driver
      secretName: mariadb
      secretUsernameKey: database-username
      secretPasswordKey: database-password
    image: # provide tag when using version other than the package specific version
      tag: 2.9.3
  registry:
    secret:
      ref: "reg-creds-dockerhub"
  feature:
    monitoring:
      grafana:
        enabled: true
      prometheusRsocketProxy:
        enabled: true
  ctr:
    image: # provide tag when using version other than the package specific version
      tag: 2.10.3
```
