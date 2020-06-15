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

|                                              | Kubernetes 1.11.x | Kubernetes 1.12.x | Kubernetes 1.13.x | Kubernetes 1.14.x | Kubernetes 1.15.x | Kubernetes 1.16.x | Kubernetes 1.17.x |
| -------------------------------------------- | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: | :---------------: |
| SCDF K8S Server: 2.6.x - K8S Deployer: 2.4.x |        ❌         |        ❌         |        ❌         |        ❌         |        ❌         |        ✅         |        ✅         |
| SCDF K8S Server: 2.5.x - K8S Deployer: 2.3.x |        ❌         |        ❌         |        ✅         |        ✅         |        ✅         |        ✅         |        ✅         |
| SCDF K8S Server: 2.4.x - K8S Deployer: 2.2.x |        ❌         |        ❌         |        ✅         |        ✅         |        ✅         |        ❌         |        ❌         |
| SCDF K8S Server: 2.3.x - K8S Deployer: 2.1.x |        ✅         |        ✅         |        ✅         |        ❌         |        ❌         |        ❌         |        ❌         |
| SCDF K8S Server: 2.2.x - K8S Deployer: 2.0.x |        ✅         |        ✅         |        ✅         |        ❌         |        ❌         |        ❌         |        ❌         |
