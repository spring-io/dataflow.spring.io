---
path: 'installation/kubernetes/creating-a-cluster'
title: 'Creating a Cluster'
description: 'Creating a Kubernetes Cluster'
---

# Creating a Cluster

The Kubernetes [Picking the Right
Solution](https://kubernetes.io/docs/setup/#production-environment) guide
lets you choose among many options, so you can pick the one that you are
most comfortable using.

All of our testing is done against [Google Kubernetes
Engine](https://cloud.google.com/kubernetes-engine/) as well as [VMware Tanzu Kubernetes Grid](https://tanzu.vmware.com/kubernetes-grid). GKE is
used as the target platform for this section.

# Configure Kubernetes for local development

We have prepared scripts to simplify the process of creating a local Minikube or Kind cluster, or to use a remote cluster like GKE or TKG.

Visit the [Spring Cloud Data Flow Reference Guide](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#local-k8s-development)
