---
path: 'installation/kubernetes/'
title: 'Kubernetes'
description: 'Data Flow Kubernetes Installation Guide'
summary: true
---

# Kubernetes

This section covers the installation **Data Flow** on **Kubernetes** using the Helm chart as well as using `kubectl`.

This guide also describes setting up an environment for testing Spring Cloud Data Flow on the Google Kubernetes Engine and is not meant to be a definitive guide for setting up a production environment.
You can adjust the suggestions to fit your test setup.
Remember that a production environment requires much more consideration for persistent storage of message queues, high availability, security, and other concerns.
Refer to [this section](%currentPath%/installation/kubernetes/creating-a-cluster) for some high level guidance for creating a Kubernetes cluster.
