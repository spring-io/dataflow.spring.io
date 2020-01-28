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

All our testing is done against [Google Kubernetes
Engine](https://cloud.google.com/kubernetes-engine/) as well as [Pivotal
Container
Service](https://pivotal.io/platform/pivotal-container-service/). GKE is
used as the target platform for this section.

# Setting Minikube Resources

We have successfully deployed with [Minikube](https://kubernetes.io/docs/getting-started-guides/minikube/).
We note where you need to adjust for deploying on Minikube.

When starting Minikube, you should allocate some extra resources,
since we deploy several services. You can start with
`minikube start --cpus=4 --memory=8192`. The allocated memory and CPU
for the Minikube VM gets directly assigned to the number of
applications deployed in a stream or task. The more you add, the more
VM resources are required.

The rest of this getting started guide assumes that you have a working
Kubernetes cluster and a `kubectl` command line utility. See [Installing
and Setting up kubectl](https://kubernetes.io/docs/user-guide/prereqs/)
for installation instructions.
