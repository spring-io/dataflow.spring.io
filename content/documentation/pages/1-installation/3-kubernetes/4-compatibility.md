---
path: 'installation/kubernetes/compatibility'
title: 'Kubernetes Compatibility'
description: 'Compatibility with Kubernetes Versions'
---

# Kubernetes Compatibility

The Spring Cloud Data Flow implementation for Kubernetes uses the
[Spring Cloud Deployer
Kubernetes](https://github.com/spring-cloud/spring-cloud-deployer-kubernetes)
library for orchestration. Before you begin setting up a Kubernetes
cluster, see the [compatibility
matrix](https://github.com/spring-cloud/spring-cloud-deployer-kubernetes#kubernetes-compatibility)
to learn more about deployer and server compatibility against Kubernetes
release versions.

The following listing outlines the compatibility between Spring Cloud
Data Flow for Kubernetes Server and Kubernetes versions:

|                                              | Kubernetes 1.18.x | Kubernetes 1.19.x | Kubernetes 1.20.x | Kubernetes 1.21.x | Kubernetes 1.22.x | Kubernetes 1.23.x |
| -------------------------------------------- | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: |
| SCDF K8S Server: 2.9.x - K8S Deployer: 2.7.x |        ❌         |        ✅         |        ✅         |        ✅         |        ✅         |        ✅         |
| SCDF K8S Server: 2.8.x - K8S Deployer: 2.6.x |        ✅         |        ✅         |        ✅         |        ✅         |        ✅         |        `?`        |
| SCDF K8S Server: 2.7.x - K8S Deployer: 2.5.x |        ✅         |        ✅         |        `?`        |        `?`        |        `?`        |        `?`        |
| SCDF K8S Server: 2.6.x - K8S Deployer: 2.4.x |        ✅         |        ✅         |        `?`        |        `?`        |        `?`        |        `?`        |
