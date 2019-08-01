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

|                                              | Kubernetes 1.11.x | Kubernetes 1.12.x | Kubernetes 1.13.x |
| -------------------------------------------- | :---------------: | :---------------: | :---------------: |
| SCDF K8S Server: 2.2.x - K8S Deployer: 2.0.4 |        ✅         |        ✅         |        ✅         |
| SCDF K8S Server: 2.1.x - K8S Deployer: 2.0.2 |        ✅         |        ✅         |        ✅         |
| SCDF K8S Server: 2.0.x - K8S Deployer: 2.0.1 |        ✅         |        ✅         |        ✅         |
| SCDF K8S Server: 1.7.x - K8S Deployer: 1.3.9 |        ✅         |        ✅         |        ✅         |
