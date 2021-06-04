---
path: 'recipes/cloud-providers/gke-regional-clusters/'
title: 'GKE Regional Clusters'
description: 'Deploying Spring Cloud Data Flow to a GKE Regional Cluster'
---

# Deploying Spring Cloud Data Flow to a GKE Regional Cluster

When deploying applications to an environment, it is often ideal to set up a strategy to handle infrastructure outages. Outages could range from hardware failures to complete data centers going offline, resulting in applications becoming unavailable. Rather than having those workloads potentially halt operations until an outage is resolved, another option is to have those workloads migrate to another part of your infrastructure to continue operations. It may also be useful to specify where particular applications must reside or be co-located with other applications.

With [Kubernetes](https://kubernetes.io/), the failure of nodes and the workloads running on them is automatically handled by rescheduling those workloads onto other available nodes. In a simple use case, a Kubernetes cluster consisting of a single control plane and multiple worker nodes residing in the same location is often implemented by default. This type of configuration, in the event of a failure, does not provide any high availability.

As this recipe is focused on Google Kubernetes Engine (GKE) as the cloud provider, location means one or more "zones" inside a particular "region". A "region" refers to a specific geographical location -- for example, `us-east1`. Within a "region", there are multiple "zones" (such as `us-east1-b`, `us-east1-c`, and so on) that are isolated from other zones. You should choose regions and zones based on your specific needs, such as CPU and GPU types, disk types, compute power, and others. You can find more in-depth information that you should review in Google's [Regions and Zones](https://cloud.google.com/compute/docs/regions-zones/) documentation.

Beyond a single-zone cluster, GKE supports two other types of clusters:

- Multi-zonal clusters: A single replica of the control plane running in a single zone with worker nodes running in multiple zones of a given region.
- Regional clusters: Multiple replicas of the control plane running in multiple zones within a given region with nodes running in the same zone as each control plane.

This recipe focuses on "Regional clusters", as it provides a greater level of high availability than "Single Zone" or "Multi-zonal" clusters.

## Prerequisites

A [Google Cloud](https://cloud.google.com/gcp/) (GCP) account with permissions to create new [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) (GKE) clusters is required. A web interface is provided to interact with GCP and GKE. There is also a command line interface, which you can get from the [Google Cloud SDK](https://cloud.google.com/sdk). Standard tooling (such as [Kubectl](https://github.com/kubernetes/kubectl/releases)) needs to be installed for interaction with Kubernetes clusters.

## Creating the Cluster

In this recipe, we use the GKE web console to create the cluster. We use the defaults in most cases, except for the location type and instance sizes. When creating a new cluster, the first bits of information to select is the "Cluster Basics". The following screenshot shows the options chosen for this demo:

![Regional Cluster Basics](images/cluster-basics.png)

The important parts of this section are:

- `Regional` is selected as the `Location Type`.
- `Region` is selected -- in this case, `us-east1`. This value should be determined by your specific requirements, as described earlier.
- `Specify default node locations` has three zones selected. Three zones are selected automatically. However, when there are more than three, this section allows explicit selection of zones.

You can customzize other values in this section (such as the `Name`, and `Master version` settings) as appropriate.

Next, the machine type is selected in the `Nodes` subsection of `Node Pools -> default-pool`, as the following image shows:

![Regional Cluster Nodes](images/cluster-nodes.png)

The main change in this section is selecting a machine type of `n1-standard-4 (4 vCPU, 15GB memory)`. This gives us a bit more room to work with than the default. You can customize settings as appropriate.

<!--TIP-->

The number of nodes and machine type vary based on your specific requirements for base needs in addition to failover tolerance. For example, you can size the selected configuration based on the expected number of applications that may be spread across those nodes. Still, in the event of a node or even one or more region failures, clusters should be sized to support this extra load. Failing to do so will result in workloads being un-schedulable until capacity is available. Various strategies can be implemented -- for example, upfront sizing, using a [cluster autoscaler](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler), and so on.

<!--END_TIP-->

With the customizations made, you can create the cluster by clicking the **Create** button, as the following image shows:

![Create Regional Cluster](images/cluster-create.png)

<!--TIP-->

While using the GKE UI can be convenient to customize your cluster configuration, the same can be done from the Google Cloud CLI. A handy way to generate this command is by clicking on the `command line` link. Doing so creates the appropriate gcloud CLI command that can be used to create the same cluster configuration.

<!--END_TIP-->

When the cluster is created, three worker nodes are deployed to each of the three regions, for a total of nine worker nodes. Note that GKE does not provide the ability to access control plane nodes.

Lastly, the credentials need to be fetched through the `gcloud` CLI so that `kubectl` can interact with the cluster. To do so, run the following command:

```
$ gcloud container clusters get-credentials regional-demo --zone us-east1 --project PROJECT_ID
```

Replace `PROJECT_ID` with your GKE project ID. Additionally, to make it easier to identify the context name, run the following command:

```
$ kubectl config rename-context gke_PROJECT_ID_us-east1_regional-demo regional-demo
```

Verify that the correct current context is set with `kubectl` (indicated by `*`):

```
$ kubectl config get-contexts
CURRENT   NAME            CLUSTER                                                   AUTHINFO                                                  NAMESPACE
*         regional-demo   gke_PROJECT_ID_us-east1_regional-demo   gke_PROJECT_ID_us-east1_regional-demo
```

## Verify the Cluster Creation

Verify that the worker nodes are available:

```
$ kubectl get nodes
NAME                                           STATUS   ROLES    AGE   VERSION
gke-regional-demo-default-pool-e121c001-k667   Ready    <none>   13m   v1.16.9-gke.2
gke-regional-demo-default-pool-e121c001-zhrt   Ready    <none>   13m   v1.16.9-gke.2
gke-regional-demo-default-pool-e121c001-zpv4   Ready    <none>   13m   v1.16.9-gke.2
gke-regional-demo-default-pool-ea10f422-5f72   Ready    <none>   13m   v1.16.9-gke.2
gke-regional-demo-default-pool-ea10f422-ntdk   Ready    <none>   13m   v1.16.9-gke.2
gke-regional-demo-default-pool-ea10f422-vw3c   Ready    <none>   13m   v1.16.9-gke.2
gke-regional-demo-default-pool-fb3e6608-0lx2   Ready    <none>   13m   v1.16.9-gke.2
gke-regional-demo-default-pool-fb3e6608-0rcc   Ready    <none>   13m   v1.16.9-gke.2
gke-regional-demo-default-pool-fb3e6608-2qsk   Ready    <none>   13m   v1.16.9-gke.2
```

As shown, there are nine nodes, with three in each pool.

Each node has a label applied by the key of `failure-domain.beta.kubernetes.io/zone` and a value of the zone in which it is located. To identify which nodes are placed in which zones, we can select the label -- for example:

```
$ kubectl get nodes -l failure-domain.beta.kubernetes.io/zone=us-east1-b
NAME                                           STATUS   ROLES    AGE   VERSION
gke-regional-demo-default-pool-ea10f422-5f72   Ready    <none>   29m   v1.16.9-gke.2
gke-regional-demo-default-pool-ea10f422-ntdk   Ready    <none>   29m   v1.16.9-gke.2
gke-regional-demo-default-pool-ea10f422-vw3c   Ready    <none>   29m   v1.16.9-gke.2
```

```
$ kubectl get nodes -l failure-domain.beta.kubernetes.io/zone=us-east1-c
NAME                                           STATUS   ROLES    AGE   VERSION
gke-regional-demo-default-pool-e121c001-k667   Ready    <none>   29m   v1.16.9-gke.2
gke-regional-demo-default-pool-e121c001-zhrt   Ready    <none>   29m   v1.16.9-gke.2
gke-regional-demo-default-pool-e121c001-zpv4   Ready    <none>   29m   v1.16.9-gke.2
```

```
$ kubectl get nodes -l failure-domain.beta.kubernetes.io/zone=us-east1-d
NAME                                           STATUS   ROLES    AGE   VERSION
gke-regional-demo-default-pool-fb3e6608-0lx2   Ready    <none>   29m   v1.16.9-gke.2
gke-regional-demo-default-pool-fb3e6608-0rcc   Ready    <none>   29m   v1.16.9-gke.2
gke-regional-demo-default-pool-fb3e6608-2qsk   Ready    <none>   29m   v1.16.9-gke.2
```

## Deploying Spring Cloud Data Flow

At this point, we have a fully functional multi-node cluster spread across three zones in one region, with three worker nodes in each zone.

Spring Cloud Data Flow provides manifest files to deploy Data Flow, Skipper, and service dependencies (such as a database and messaging middleware). These files are located in the `src/kubernetes` directory of the [Spring Cloud Data Flow](https://github.com/spring-cloud/spring-cloud-dataflow/) Git repository.

You can apply the relevant files as-is, letting Kubernetes handle where they should be scheduled, but you can also modify where you want these applications to be deployed, the number of instances, and so on by using standard Kubernetes constructs.

In this recipe, we implement the following use case for our deployment:

- Three replicas of Skipper should be deployed, one replica per region.
- Three replicas of Data Flow should be deployed, one replica per region, co-located on the same node as Skipper.
- MySQL is used as the database and is placed in a specific zone.
- RabbitMQ is used as the messaging middleware and is placed in a specific zone.

### Deploying MySQL

<!--NOTE-->

In this recipe, an instance of MySQL is being deployed to a single zone. See the relevant high availability documentation of the [MySQL](https://dev.mysql.com/doc/) product for more details. In the event of a zone failure, MySQL may be unavailable. Setting up MySQL for HA is outside the scope of SCDF and this recipe.

<!--END_NOTE-->

The deployment of MySQL consists of one replica. MySQL uses persistent storage and the creation of and access to that storage is governed by the rules outlined in [persistent storage in regional clusters](https://cloud.google.com/kubernetes-engine/docs/concepts/regional-clusters#pd). Unless a `StorageClass` is defined that references a specific zone in which it should be created, GKE chooses a random zone. A custom `StorageClass` would then be referenced in the `PVC` configuration for MySQL.

A default `StorageClass`, which we use for simplicity, is automatically created by GKE. Any pods referencing a provisioned disk are automatically scheduled in the same zone in which the disk is provisioned. Since we have three nodes in each zone, in the event of a node failure, the MySQL pod is rescheduled to another node in the zone.

Deploy the manifests:

```
$ kubectl create -f mysql/
deployment.apps/mysql created
persistentvolumeclaim/mysql created
secret/mysql created
service/mysql created
```

Get the volume name:

```
$ kubectl get pvc/mysql
NAME    STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
mysql   Bound    pvc-24f2acb5-17cd-45e1-8064-34bf602e408f   8Gi        RWO            standard       3m1s
```

Check the zone in which the volume is located:

```
$ kubectl get pv/pvc-24f2acb5-17cd-45e1-8064-34bf602e408f -o jsonpath='{.metadata.labels.failure-domain\.beta\.kubernetes\.io/zone}'
us-east1-d
```

Check the MySQL pod to verify it is running and the node to which it is allocated:

```
$ kubectl get pod/mysql-b94654bd4-9zpt2 -o=custom-columns=NAME:.metadata.name,STATUS:.status.phase,NODE:.spec.nodeName
NAME                    STATUS    NODE
mysql-b94654bd4-9zpt2   Running   gke-regional-demo-default-pool-fb3e6608-0rcc
```

Finally, verify the zone in which the node resides:

```
$ kubectl get node gke-regional-demo-default-pool-fb3e6608-0rcc -o jsonpath='{.metadata.labels.failure-domain\.beta\.kubernetes\.io/zone}'
us-east1-d
```

### Deploying RabbitMQ

<!--NOTE-->

In this recipe, an instance of RabbitMQ is being deployed to a single zone. See the relevant high availability documentation of the [RabbitMQ](https://www.rabbitmq.com/documentation.html) product for more details. In the event of a zone failure, RabbitMQ may be unavailable. Setting up RabbitMQ for HA is outside the scope of SCDF and this recipe.

<!--END_NOTE-->

The deployment of RabbitMQ consists of one replica. The provided manifests do not configure any persistent storage, as with MySQL. To place RabbitMQ in a specific zone, we can use a simple [`nodeSelector`](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector).

The node to which a pod gets scheduled may not be a concern -- it merely means that the pod resides in a specific zone. All nodes in the cluster automatically get labels assigned. One of those labels represents the zone in which the node resides, which we will use.

To place RabbitMQ on a node in the `us-east1-b` zone, make the following modification to the `rabbitmq/rabbitmq-deployment.yaml` file:

```
    spec:
      nodeSelector:
        failure-domain.beta.kubernetes.io/zone: us-east1-b
```

Deploy the manifests:

```
$ kubectl create -f rabbitmq/
deployment.apps/rabbitmq created
service/rabbitmq created
```

Get the node to which the pod is deployed:

```
$ kubectl get pod/rabbitmq-6d65f675d9-4vksj -o jsonpath='{.spec.nodeName}'
gke-regional-demo-default-pool-ea10f422-5f72
```

Get the zone in which the node resides:

```
$ kubectl get node gke-regional-demo-default-pool-ea10f422-5f72 -o jsonpath='{.metadata.labels.failure-domain\.beta\.kubernetes\.io/zone}'
us-east1-b
```

### Deploying Skipper

The deployment of Skipper consists of three replicas. No persistent storage is needed, and we want a replica to be running in each zone. Multiple replicas should not reside in the same zone. One way to do this is to use [pod anti-affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity).

Make the following modifications to the `skipper/skipper-deployment.yaml` file, bumping up the replica count and adding the pod anti-affinity:

```
spec:
  replicas: 3
```

```
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - skipper
            topologyKey: failure-domain.beta.kubernetes.io/zone
```

Deploy the manifests:

```
$ kubectl create -f server/server-roles.yaml
$ kubectl create -f server/server-rolebinding.yaml
$ kubectl create -f server/service-account.yaml
$ kubectl create -f skipper/skipper-config-rabbit.yaml
$ kubectl create -f skipper/skipper-deployment.yaml
$ kubectl create -f skipper/skipper-svc.yaml
```

Get the nodes to which the pods are deployed:

```
$ kubectl get pods -l app=skipper -o=custom-columns=NAME:.metadata.name,STATUS:.status.phase,NODE:.spec.nodeName
NAME                       STATUS    NODE
skipper-6fd7bb796c-flm44   Running   gke-regional-demo-default-pool-e121c001-zhrt
skipper-6fd7bb796c-l99dj   Running   gke-regional-demo-default-pool-ea10f422-5f72
skipper-6fd7bb796c-vrf9m   Running   gke-regional-demo-default-pool-fb3e6608-0lx2
```

Get the zones in which the nodes reside:

```
$ kubectl get node gke-regional-demo-default-pool-e121c001-zhrt -o jsonpath='{.metadata.labels.failure-domain\.beta\.kubernetes\.io/zone}'
us-east1-c
$ kubectl get node gke-regional-demo-default-pool-ea10f422-5f72 -o jsonpath='{.metadata.labels.failure-domain\.beta\.kubernetes\.io/zone}'
us-east1-b
$ kubectl get node gke-regional-demo-default-pool-fb3e6608-0lx2 -o jsonpath='{.metadata.labels.failure-domain\.beta\.kubernetes\.io/zone}'
us-east1-d
```

### Deploying Data Flow

The deployment of Data Flow consist of three replicas. No persistent storage is needed, and we want to have a replica running in each zone. Multiple replicas should not reside in the same zone. Additionally, since Data Flow makes calls to Skipper often, we want to co-locate it on the same node in each region. One way to do this would be using [pod affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity).

Make the following modifications to the `server/server-deployment.yaml` file, bumping up the replica count and adding the pod affinity:

```
spec:
  replicas: 3
```

```
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - skipper
        topologyKey: kubernetes.io/hostname
```

Deploy the manifests:

```
$ kubectl create -f server/server-config.yaml
$ kubectl create -f server/server-svc.yaml
$ kubectl create -f server/server-deployment.yaml
```

Get the nodes to which the pods are deployed:

```
$ kubectl get pods -l app=scdf-server -o=custom-columns=NAME:.metadata.name,STATUS:.status.phase,NODE:.spec.nodeName
NAME                           STATUS    NODE
scdf-server-5ddf7bbd4f-dpnmm   Running   gke-regional-demo-default-pool-fb3e6608-0lx2
scdf-server-5ddf7bbd4f-hlf9h   Running   gke-regional-demo-default-pool-e121c001-zhrt
scdf-server-5ddf7bbd4f-vnjh6   Running   gke-regional-demo-default-pool-ea10f422-5f72
```

Verify that the pods are deployed to the same nodes as Skipper:

```
$ kubectl get pods -l app=skipper -o=custom-columns=NAME:.metadata.name,STATUS:.status.phase,NODE:.spec.nodeName
NAME                       STATUS    NODE
skipper-6fd7bb796c-flm44   Running   gke-regional-demo-default-pool-e121c001-zhrt
skipper-6fd7bb796c-l99dj   Running   gke-regional-demo-default-pool-ea10f422-5f72
skipper-6fd7bb796c-vrf9m   Running   gke-regional-demo-default-pool-fb3e6608-0lx2
```

Verify the connectivity to Data Flow:

```
$ SCDF_IP=$(kubectl get svc/scdf-server -o jsonpath='{.status.loadBalancer.ingress[*].ip}')
$ curl -s http://$SCDF_IP/about | jq
{
  "featureInfo": {
    "analyticsEnabled": true,
    "streamsEnabled": true,
    "tasksEnabled": true,
    "schedulesEnabled": true,
    "grafanaEnabled": true
  },
  "versionInfo": {
    "implementation": {
      "name": "spring-cloud-dataflow-server",
      "version": "2.7.0-SNAPSHOT"
    },
...
...
...
```

## Deploying Streams and Tasks

Streams and Tasks deployed through Data Flow can also benefit from various placement options, just as with server components. There may be situations where certain streams or tasks should only be deployed to specific zones or even nodes themselves. Deployed streams and tasks are applications like any others, so they also benefit from Kubernetes re-scheduling them onto other nodes in the event of failures.

Since streams and tasks are deployed to Kubernetes by Data Flow and Skipper, rather than applying these features to YAML manifests, they are set through deployer properties. See the [Deployer Property](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#configuration-kubernetes-deployer) section of the Spring Cloud Data Flow reference manual for a full list of available deployer properties.

The deployer properties of interest are:

Node selector:

- `deployment.nodeSelector`

Tolerations:

- `tolerations.key`
- `tolerations.effect`
- `tolerations.operator`
- `tolerations.tolerationSeconds`
- `tolerations.value`

Node Affinity:

- `affinity.nodeAffinity`

Pod Affinity:

- `affinity.podAffinity`

Pod Anti-Affinity:

- `affinity.podAntiAffinity`

For a concrete example of how to set deployment properties at the application or server level, see the [Tolerations](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#_tolerations) section of the reference manual. The same pattern applies to other properties, with different property names and values.

## Conclusion

In this recipe, we have set up a regional cluster in GKE, providing the infrastructure to provide high availability control planes and workers across multiple zones in a region. We explored different options for application placement by using constructs such as a node selector, pod affinity, and pod anti-affinity. Each application and environment has its own specialized needs, but this recipe should provide a starting point for how you can use standard Kubernetes constructs with Data Flow.
