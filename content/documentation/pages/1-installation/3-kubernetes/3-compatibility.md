---
path: 'installation/kubernetes/compatibility'
title: 'Kubernetes Compatibility'
description: 'Compatibility with Kubernetes  Versions'
---

### Kubernetes Compatibility

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

    | Versions: SCDF K8S Server - K8S Deployer \ Kubernetes | 1.9.x | 1.10.x | 1.11.x |
    |-------------------------------------------------------|-------|--------|--------|
    | Server: 1.4.x - Deployer: 1.3.2                       | ✓     | ✓      | ✓      |
    | Server: 1.5.x - Deployer: 1.3.6                       | ✓     | ✓      | ✓      |
    | Server: 1.6.x - Deployer: 1.3.7                       | ✓     | ✓      | ✓      |
    | Server: 1.7.x - Deployer: 1.3.9                       | ✓     | ✓      | ✓      |
    | Server: 2.0.x - Deployer: 2.0.1                       | ✓     | ✓      | ✓      |
    |---------------------------------------------------------------------------------|
