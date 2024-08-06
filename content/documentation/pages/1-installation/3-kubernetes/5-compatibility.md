---
path: 'installation/kubernetes/compatibility'
title: 'Kubernetes Compatibility'
description: 'Compatibility with Kubernetes Versions'
---

# Kubernetes Compatibility

The Spring Cloud Data Flow implementation for Kubernetes uses the
[Spring Cloud Deployer Kubernetes](https://github.com/spring-cloud/spring-cloud-deployer/tree/main/spring-cloud-deployer-kubernetes)
library for orchestration. Before you begin setting up a Kubernetes
cluster, see the [compatibility matrix](https://github.com/spring-cloud/spring-cloud-deployer/tree/main/spring-cloud-deployer-kubernetes#kubernetes-compatibilit)
to learn more about deployer and server compatibility against Kubernetes
release versions.

The following listing outlines the compatibility between Spring Cloud
Data Flow for Kubernetes Server and Kubernetes versions:

| Kubernetes Version                            | v1.20.x | v1.21.x | v1.22.x | v1.23.x | v1.24.x | v1.25.x | v1.26.x | v1.27.x | v1.28.x | v1.29.x | v1.30.x |
|-----------------------------------------------|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| SCDF K8S Server: 2.11.x - K8S Deployer: 2.9.x |   ❌    |   ✅    |   ✅    |    ✅   |    ✅   |    ✅   |    ✅   |    ✅   |    ✅   |    ✅   |    ✅    |
| SCDF K8S Server: 2.10.x - K8S Deployer: 2.8.x |   ✅    |   ✅    |   ✅    |    ✅   |    ✅   |    ❌   |    ❌   |    ❌   |    ❌   |    ❌   |    ❌    | 
| SCDF K8S Server: 2.9.x - K8S Deployer: 2.7.x  |   ✅    |   ✅    |   ✅    |   `?`   |   `?`   |    ❌   |    ❌   |    ❌   |    ❌   |    ❌   |    ❌    |
| SCDF K8S Server: 2.8.x - K8S Deployer: 2.7.x  |   `?`   |   `?`   |   `?`   |   `?`   |   `?`   |    ❌   |    ❌   |    ❌   |    ❌   |    ❌   |    ❌    |
