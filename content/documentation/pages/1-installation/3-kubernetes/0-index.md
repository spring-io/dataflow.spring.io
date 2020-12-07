---
path: 'installation/kubernetes/'
title: 'Kubernetes'
description: 'Data Flow Kubernetes Installation Guide'
summary: true
---

# Kubernetes

This section covers the installation **Data Flow** on **Kubernetes** by using the Helm chart and by using `kubectl`.

This guide also describes how to set up an environment for testing Spring Cloud Data Flow on the Google Kubernetes Engine.
It is not meant to be a definitive guide for setting up a production environment.
You can adjust the suggestions to fit your test setup.
Remember that a production environment requires much more consideration for persistent storage of message queues, high availability, security, and other concerns.
See [the Creating a Cluster section](%currentPath%/installation/kubernetes/creating-a-cluster) for some high-level guidance about creating a Kubernetes cluster.
