---
path: 'recipes/batch/sftp-to-jdbc/'
title: 'SFTP to JDBC'
description: 'Ingest Files from SFTP to a JDBC data store using Data Flow and Spring Batch'
---

# SFTP to JDBC File Ingest

This recipe provides step by step instructions to build a Data Flow pipeline to ingest files from an SFTP source and save the contents to a JDBC data store.
The pipeline is designed to launch a task whenever a new file is detected by the SFTP source.
In this case, the task is a Spring Batch job that processes the file, converting the contents of each line to uppercase, and inserting it into a table.

The [file ingest](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-website/recipes/file-ingest/file-to-jdbc) batch job reads from a CSV text file with lines formatted as `first_name,last_name` and writes each entry to a database table by using a [`JdbcBatchItemWriter`](https://docs.spring.io/spring-batch/trunk/apidocs/org/springframework/batch/item/database/JdbcBatchItemWriter.html)] that performs `INSERT INTO people (first_name, last_name) VALUES (:firstName, :lastName)` for each line.

You can [download the project](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/recipes/file-ingest/file-to-jdbc/file-to-jdbc.zip?raw=true) that contains the source code and sample data from your browser or from the command line:

```bash
wget https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/recipes/file-ingest/file-to-jdbc/file-to-jdbc.zip?raw=true -O file-to-jdbc.zip
```

<!--TIP-->

If you choose not to build the task application yourself, the executable jar is published to the [Spring Maven repository](https://repo.spring.io/libs-snapshot-local/io/spring/cloud/dataflow/ingest/ingest/1.0.0.BUILD-SNAPSHOT/) and to the [springcloud/ingest](https://hub.docker.com/r/springcloud/ingest/) Docker repository.

<!--END_TIP-->

The pipeline is built by using the following pre-packaged Spring Cloud Stream applications:

- [sftp-dataflow-source](https://github.com/spring-cloud-stream-app-starters/sftp/tree/master/spring-cloud-starter-stream-source-sftp-dataflow) is an SFTP source configured to emit a Task Launch Request whenever it detects a new file in one or more polled SFTP directories.
- [dataflow-task-launcher-sink](https://github.com/spring-cloud-stream-app-starters/tasklauncher-dataflow/tree/master/spring-cloud-starter-stream-sink-task-launcher-dataflow) is a sink that acts as a REST client to the Data Flow server to launch a Data Flow task.

This pipeline runs on all supported Data Flow platforms.
The SFTP source downloads each file from the SFTP server to a local directory before sending the task launch request.
The request sets `localFilePath` as a command line argument for the task. When running on a cloud platform, we need to mount a shared directory available to the SFTP source container and the task container.
For this example, we set up an NFS mounted directory.
Configuring the environment and containers for NFS is platform-specific and is described here for Cloud Foundry v2.3+ and minikube.

## Prerequisites

This section covers the set up and configuration steps you need to do before starting the batch application.

### Data Flow Installation

Make sure you have installed Spring Cloud Data Flow to the platform of your choice:

- [Local](%currentPath%/installation/local/)
- [Cloud Foundry](%currentPath%/installation/cloudfoundry)
- [Kubernetes](%currentPath%/installation/kubernetes/)

<!-- TODO: Support for Postgres -->
<!--NOTE-->

**NOTE**: For Kubernetes, the sample task application is configured to use MySQL. The Data Flow server must also be configured for MySQL.

<!--END_NOTE-->

### Using Data Flow

This example assumes that you know how to use Spring Cloud Data Flow to register and deploy applications by using the Spring Cloud Data Flow dashboard or the Spring Cloud Data Flow shell. If you need further instructions on using Data Flow see [Stream Processing by Using Spring Cloud Data Flow](%currentPath%/stream-developer-guides/streams/data-flow-stream) and [Register and Launch a Batch Application by Using Spring Cloud Data Flow](%currentPath%/batch-developer-guides/batch/data-flow-spring-batch/).

### SFTP server

This example requires access to an SFTP server. For running on a `local` machine and `minikube`, we use the host machine as the SFTP server. For `Cloud Foundry`, and `Kubernetes` in general, an external SFTP server is required.
On the SFTP server, create a `/remote-files` directory. This is where we drop files to trigger the pipeline.

### NFS configuration

<!--TIP-->

NFS is not required when running locally.

<!--END_TIP-->

#### Cloud Foundry NFS configuration

This feature is provided in Pivotal Cloud Foundry by [NFS Volume Services](https://docs.pivotal.io/pivotalcf/2-5/devguide/services/using-vol-services.html)

To run this example, we need:

- A Cloud Foundry instance (v2.3+) with NFS Volume Services [enabled](https://docs.pivotal.io/pivotalcf/2-5/opsguide/enable-vol-services.html)
- An NFS server accessible from the Cloud Foundry instance
- A properly configured `nfs` service instance

<!--NOTE-->

**NOTE:** For simplicity, this example assumes the `nfs` service is created with common configuration as follows with a common mount point (`/var/scdf`) for all bound apps. You can also set these parameters when binding the NFS service to an application by using [deployment propterties](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#configure-service-binding-parameters):

```bash
cf create-service nfs Existing nfs -c '{"share":<nfs-host>/staging","uid":<uid>,"gid":<gid>, "mount":"/var/scdf"}'
```

<!--END_NOTE-->

#### Kubernetes NFS configuration

Kubernetes provides many options for configuring and sharing persistent volumes. For this example, we use `minikube` and use the host machine as the NFS server. The following instructions works for `OS/X` and should be similar for Linux hosts:

Make sure minikube is started. The commands in these instructions provide NFS access to the minikube VM. The minikube IP is subject to change each time it is started, so you should perform these steps after each start.

Expose a shared directory called `/staging`.

```bash
sudo mkdir /staging
sudo chmod 777 /staging
sudo echo "/staging -alldirs -mapall="$(id -u)":"$(id -g)" $(minikube ip)" >> /etc/exports
sudo nfsd restart
```

Verify the NFS mounts:

```bash
showmount -e 127.0.0.1
Exports list on 127.0.0.1:
/staging 192.168.99.105
```

Configure persistent volume and persistent volume claim resources. Copy the following and save it to a file named `nfs-config.yml`:

```yaml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-volume
spec:
  capacity:
    storage: 4Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: standard
  nfs:
    # The address 192.168.99.1 is the Minikube gateway to the host for VirtualBox. This way
    # not the container IP will be visible by the NFS server on the host machine,
    # but the IP address of the `minikube ip` command. You will need to
    # grant access to the `minikube ip` IP address.
    server: 192.168.99.1
    path: '/staging'

---
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: nfs-volume-claim
  namespace: default
spec:
  storageClassName: standard
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 4Gi
```

Create the resources:

```bash
kubectl apply -f nfs-config.yml
```

## Deployment

This section addresses how to deploy to the following environments:

- Local
- Cloud Foundry
- Kubernetes

### Local

For local deployment, this example uses Kafka as the message broker.
Create directories for the remote and local files:

```bash
mkdir -p /tmp/remote-files /tmp/local-files
```

#### Register the Applications

If you downloaded and built the [sample project](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/recipes/file-ingest/file-to-jdbc/file-to-jdbc.zip?raw=true), you can register it by using a `file://` URL. e.g. `file://<path-to-project>/target/ingest-1.0.0-SNAPSHOT.jar`
Otherwise, you can use the published Maven jar:

```bash
app register --name fileIngest --type task --uri maven://io.spring.cloud.dataflow.ingest:ingest:1.0.0.BUILD-SNAPSHOT
```

Register the prepackaged `sftp` source and `task-launcher` sink applications:

```bash
app register --name sftp --type source  --uri maven://org.springframework.cloud.stream.app:sftp-dataflow-source-kafka:2.1.0.RELEASE
```

```bash
app register --name task-launcher --type sink --uri maven://org.springframework.cloud.stream.app:task-launcher-dataflow-sink-kafka:1.0.1.RELEASE
```

#### Create the Task

To create the task, run the following command:

```bash
task create fileIngestTask --definition fileIngest
```

#### Create and Deploy the Stream

To create and deploy the stream, run the following command:

<!--NOTE-->

**NOTE**: Replace `<user>` and `<pass>`.
The `username` and `password` are the credentials for the local (or remote) user.
If you do not use a local SFTP server, specify the host by setting the `host` parameter
(and, optionally, the `port` parameter). If not defined, `host` defaults to `127.0.0.1`
and `port` defaults to `22`.

<!--END_NOTE-->

```bash
stream create --name inboundSftp --definition "sftp --username=<user> --password=<pass> --allow-unknown-keys=true --task.launch.request.taskName=fileIngestTask --remote-dir=/tmp/remote-files/ --local-dir=/tmp/local-files/ | task-launcher" --deploy
```

<!--TIP-->

The [dataflow-task-launcher-sink](https://github.com/spring-cloud-stream-app-starters/tasklauncher-dataflow/tree/master/spring-cloud-starter-stream-sink-task-launcher-dataflow) uses a [`PollableMessageSource`](https://docs.spring.io/spring-cloud-stream/docs/Elmhurst.BUILD-SNAPSHOT/api/org/springframework/cloud/stream/binder/PollableMessageSource.html) controlled by a dynamic trigger with exponential backoff. By default, the sink polls its input destination every second. If there are no task launch requests, the polling period continues to double up to a maximum of 30 seconds. If a task launch request is present, the trigger resets to one second. You can continue the trigger parameters by setting the `task-launcher` sink properties, `trigger.period` and `trigger.max-period`, in the stream definition.

<!--END_TIP-->

#### Verify Stream deployment

We can see the status of the streams to be deployed with `stream list`, as the following example shows:

```bash
dataflow:>stream list
╔═══════════╤════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╤════════════════════════════╗
║Stream Name│                                                         Stream Definition                                                          │           Status           ║
╠═══════════╪════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╪════════════════════════════╣
║inboundSftp│sftp --password='******' --remote-dir=/tmp/remote-files/ --local-dir=/tmp/local-files/ --task.launch.request.taskName=fileIngestTask│The stream has been         ║
║           │--allow-unknown-keys=true --username=<user> | task-launcher                                                                         │successfully deployed       ║
╚═══════════╧════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╧════════════════════════════╝
```

#### Inspect the Application Logs

In the event the stream failed to deploy or you would like to inspect the logs for any reason, you can get the location of the logs to applications created for the `inboundSftp` stream by using the `runtime apps` command, as follows:

```bash
dataflow:>runtime apps
╔═══════════════════════════╤═══════════╤════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║   App Id / Instance Id    │Unit Status│                                                                     No. of Instances / Attributes                                                                      ║
╠═══════════════════════════╪═══════════╪════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║inboundSftp.sftp           │ deployed  │                                                                                   1                                                                                    ║
║                           │           │       guid = 23057                                                                                                                                                     ║
║                           │           │        pid = 71927                                                                                                                                                     ║
║                           │           │       port = 23057                                                                                                                                                     ║
╟───────────────────────────┼───────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢
║inboundSftp.sftp-0         │ deployed  │     stderr = /var/folders/hd/5yqz2v2d3sxd3n879f4sg4gr0000gn/T/spring-cloud-deployer-120915912946760306/inboundSftp-1540821009913/inboundSftp.sftp/stderr_0.log         ║
║                           │           │     stdout = /var/folders/hd/5yqz2v2d3sxd3n879f4sg4gr0000gn/T/spring-cloud-deployer-120915912946760306/inboundSftp-1540821009913/inboundSftp.sftp/stdout_0.log         ║
║                           │           │        url = http://192.168.64.1:23057                                                                                                                                 ║
║                           │           │working.dir = /var/folders/hd/5yqz2v2d3sxd3n879f4sg4gr0000gn/T/spring-cloud-deployer-120915912946760306/inboundSftp-1540821009913/inboundSftp.sftp                      ║
╟───────────────────────────┼───────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢
║inboundSftp.task-launcher  │ deployed  │                                                                                   1                                                                                    ║
╟───────────────────────────┼───────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢
║                           │           │       guid = 60081                                                                                                                                                     ║
║                           │           │        pid = 71926                                                                                                                                                     ║
║                           │           │       port = 60081                                                                                                                                                     ║
║inboundSftp.task-launcher-0│ deployed  │     stderr = /var/folders/hd/5yqz2v2d3sxd3n879f4sg4gr0000gn/T/spring-cloud-deployer-120915912946760306/inboundSftp-1540820991695/inboundSftp.task-launcher/stderr_0.log║
║                           │           │     stdout = /var/folders/hd/5yqz2v2d3sxd3n879f4sg4gr0000gn/T/spring-cloud-deployer-120915912946760306/inboundSftp-1540820991695/inboundSftp.task-launcher/stdout_0.log║
║                           │           │        url = http://192.168.64.1:60081                                                                                                                                 ║
║                           │           │working.dir = /var/folders/hd/5yqz2v2d3sxd3n879f4sg4gr0000gn/T/spring-cloud-deployer-120915912946760306/inboundSftp-1540820991695/inboundSftp.task-launcher             ║
╚═══════════════════════════╧═══════════╧════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

```

#### Copying a File into the Remote Directory

Normally, data would be uploaded to an SFTP server.
We simulate this by copying a file into the directory specified by `--remote-dir`.
You can find sample data in the `data/` directory of the [sample project](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/recipes/file-ingest/file-to-jdbc/file-to-jdbc.zip?raw=true).

Copy `data/name-list.csv` into the `/tmp/remote-files` directory, which the SFTP source is monitoring.
When this file is detected, the `sftp` source downloads it to the `/tmp/local-files` directory specified by `--local-dir`, and emits a task launch request.
The task launch request includes the name of the task to launch along with the local file path, given as a command line argument.
Spring Batch binds each command line argument to a corresponding `JobParameter`.
The `FileIngestTask` job processes the file given by the `JobParameter` named `localFilePath`.
Since there have not been any recent requests, the task launches within 30 seconds after the request is published (see the earlier tip above about configuring the launch trigger).

```bash
cp data/name-list.csv /tmp/remote-files
```

When the batch job launches, you see something like this in the SCDF console log:

```bash
2018-10-26 16:47:24.879  INFO 86034 --- [nio-9393-exec-7] o.s.c.d.spi.local.LocalTaskLauncher      : Command to be executed: /Library/Java/JavaVirtualMachines/jdk1.8.0_60.jdk/Contents/Home/jre/bin/java -jar <path-to>/batch/file-ingest/target/ingest-1.0.0.jar localFilePath=/tmp/local-files/name-list.csv --spring.cloud.task.executionid=1
2018-10-26 16:47:25.100  INFO 86034 --- [nio-9393-exec-7] o.s.c.d.spi.local.LocalTaskLauncher      : launching task fileIngestTask-8852d94d-9dd8-4760-b0e4-90f75ee028de
   Logs will be in /var/folders/hd/5yqz2v2d3sxd3n879f4sg4gr0000gn/T/fileIngestTask3100511340216074735/1540586844871/fileIngestTask-8852d94d-9dd8-4760-b0e4-90f75ee028de
```

#### Inspect Job Executions

After data is received and the batch job runs, it is recorded as a job execution. We can view job executions by, for example, issuing the following command in the Spring Cloud Data Flow shell:

```bash
dataflow:>job execution list
╔═══╤═══════╤═════════╤════════════════════════════╤═════════════════════╤══════════════════╗
║ID │Task ID│Job Name │         Start Time         │Step Execution Count │Definition Status ║
╠═══╪═══════╪═════════╪════════════════════════════╪═════════════════════╪══════════════════╣
║1  │1      │ingestJob│Tue May 01 23:34:05 EDT 2018│1                    │Created           ║
╚═══╧═══════╧═════════╧════════════════════════════╧═════════════════════╧══════════════════╝
```

We can also list more details about that specific job execution:

```bash
dataflow:>job execution display --id 1
╔═══════════════════════════════════════╤══════════════════════════════╗
║                  Key                  │            Value             ║
╠═══════════════════════════════════════╪══════════════════════════════╣
║Job Execution Id                       │1                             ║
║Task Execution Id                      │1                             ║
║Task Instance Id                       │1                             ║
║Job Name                               │ingestJob                     ║
║Create Time                            │Fri Oct 26 16:57:51 EDT 2018  ║
║Start Time                             │Fri Oct 26 16:57:51 EDT 2018  ║
║End Time                               │Fri Oct 26 16:57:53 EDT 2018  ║
║Running                                │false                         ║
║Stopping                               │false                         ║
║Step Execution Count                   │1                             ║
║Execution Status                       │COMPLETED                     ║
║Exit Status                            │COMPLETED                     ║
║Exit Message                           │                              ║
║Definition Status                      │Created                       ║
║Job Parameters                         │                              ║
║-spring.cloud.task.executionid(STRING) │1                             ║
║run.id(LONG)                           │1                             ║
║localFilePath(STRING)                  │/tmp/local-files/name-list.csv║
╚═══════════════════════════════════════╧══════════════════════════════╝
```

#### Verify Data

When the the batch job runs, it processes the file in the local directory (`/tmp/local-files`), transforms each item to uppercase names, and inserts it into the database.

You can use any database tool that supports the H2 database to inspect the data.
In this example, we use the DBeaver database tool.
We can inspect the table to ensure our data was processed correctly.

Within DBeaver, create a connection to the database by using the JDBC URL `jdbc:h2:tcp://localhost:19092/mem:dataflow` and user `sa` with no password.
When connected, expand the `PUBLIC` schema, expand `Tables`, and double click on the `PEOPLE` table.
When the table data loads, click the **Data** tab to view the data.

### Cloud Foundry

This section describes how to set up Spring Batch and Spring Cloud Data Flow on Cloud Foundry and then create our example batch process.

#### Prerequisites

Running this example on Cloud Foundry requires:

- Configuring an NFS server and creating an `nfs` service to access it as described in the [Cloud Foundry NFS Configuration](%currentPath%/recipes/batch/sftp-to-jdbc/#cloud-foundry-nfs-configuration) section.
- An external SFTP server with a `/remote-files` directory.
- A `mysql` service instance
- A `rabbit` service instance
- [PivotalMySQLWeb](https://github.com/pivotal-cf/PivotalMySQLWeb) or another database tool to view the data

#### Register the Applications

To register the applications, run the following command:

```bash
app register --name fileIngest --type task --uri maven://io.spring.cloud.dataflow.ingest:ingest:1.0.0.BUILD-SNAPSHOT
```

Then register the prepackaged `sftp` source and `task-launcher` sink applications:

```bash
app register --name sftp --type source  --uri maven://org.springframework.cloud.stream.app:sftp-dataflow-source-kafka:2.1.0.RELEASE
```

```bash
app register --name task-launcher --type sink --uri maven://org.springframework.cloud.stream.app:task-launcher-dataflow-sink-kafka:1.0.1.RELEASE
```

#### Create the Task

To creat the task, run the following command:

```bash
task create fileIngestTask --definition fileIngest
```

#### Create the Stream

The `sftp` source is configured to publish a task launch request that launches the `fileIngestTask` task.
The launch request binds the `nfs` service to the task container by using deployment properties `task.launch.request.deployment-properties=deployer.*.cloudfoundry.services=nfs`.

<!--NOTE-->

**NOTE**: Replace `<user>`, `<pass>`,`<host>` and `<data-flow-server-uri>` in the following stream definition.

<!--END_NOTE-->

```bash
stream create --name inboundSftp --definition "sftp --username=<user> --password=<pass> --host=<host>  --allow-unknown-keys=true --remote-dir=/remote-files/ --local-dir=/var/scdf/shared-files/ --task.launch.request.taskName=fileIngestTask --task.launch.request.deployment-properties=deployer.*.cloudfoundry.services=nfs | task-launcher --spring.cloud.dataflow.client.server-uri=<data-flow-server-uri>"
```

<!--TIP-->

The [dataflow-task-launcher-sink](https://github.com/spring-cloud-stream-app-starters/tasklauncher-dataflow/tree/master/spring-cloud-starter-stream-sink-task-launcher-dataflow) uses a [`PollableMessageSource`](https://docs.spring.io/spring-cloud-stream/docs/Elmhurst.BUILD-SNAPSHOT/api/org/springframework/cloud/stream/binder/PollableMessageSource.html) controlled by a dynamic trigger with exponential backoff. By default, the sink polls its input destination every 1 second. If there are no task launch requests, the polling period continues to double, to a maximum of 30 seconds. If a task launch request is present, the trigger resets to 1 second. You can configure the trigger parameters by setting the `task-launcher` sink properties, `trigger.period` and `trigger.max-period`, in the stream definition.

<!--END_TIP-->

#### Deploy the stream

When we deploy the stream, we must also configure the `sftp` pod by running the following command:

```bash
stream deploy inboundSftp --properties "deployer.sftp.cloudfoundry.services=nfs"
```

#### Verify Stream Deployment

We can see the status of the streams to be deployed with `stream list`, as the following example shows:

```bash
dataflow:>stream list
╔═══════════╤═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╤═══════════════════╗
║Stream Name│                                                                                     Stream Definition                                                                                     │      Status       ║
╠═══════════╪═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╪═══════════════════╣
║inboundSftp│sftp --task.launch.request.deployment-properties='deployer.*.cloudfoundry.services=nfs' --sftp.factory.password='******' --sftp.local-dir=/var/scdf/shared-files/                          │The stream has been║
║           │--sftp.factory.allow-unknown-keys=true --sftp.factory.username='******' --sftp.remote-dir=/remote-files/ --sftp.factory.host=<host> --task.launch.request.taskName=fileIngestTask |        │successfully       ║
║           │task-launcher --spring.cloud.dataflow.client.server-uri=<data-flow-server-uri                                                                                                              │deployed           ║
╚═══════════╧═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╧═══════════════════╝

```

#### Inspect the Application Logs

Use the Cloud Foundry CLI to list the apps. The `source` and `sink` applications should be in a started state.

```bash
cf apps
Getting apps in org myorg / space myspace as someuser...
OK

name                                   requested state   instances   memory   disk   urls
...
Ky7Uk6q-inboundSftp-sftp-v1            started           1/1         2G       1G     Ky7Uk6q-inboundSftp-sftp-v1.apps.hayward.cf-app.com
Ky7Uk6q-inboundSftp-task-launcher-v1   started           1/1         2G       1G     Ky7Uk6q-inboundSftp-task-launcher-v1.apps.hayward.cf-app.com
...
```

The log files of the `sftp` source would be useful to debug issues such as SFTP connection failures and to verify SFTP downloads. To view the logs, run the following command:

```bash
cf logs Ky7Uk6q-inboundSftp-sftp-v1 --recent
```

The logs for the `task-launcher` application would also be useful to debug data flow connection issues and verify task launch requests:

```bash
cf logs Ky7Uk6q-inboundSftp-task-launcher-v1 --recent
```

#### Copy a File into the Remote Directory

You can find sample data in the `data/` directory of the [sample project](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/recipes/file-ingest/file-to-jdbc/file-to-jdbc.zip?raw=true).

Connect to the SFTP server and upload `data/name-list.csv` into the `remote-files` directory.

When this file is detected, the `sftp` source downloads it to the `/var/scdf/shared-files` directory specified by `--local-dir`. We use the `/var/scdf` shared mount path that we configured for the `nfs` service. When the file is downloaded, the source emits a task launch request.
The task launch request includes the name of the task to launch along with the local file path, given as a command line argument.
Spring Batch binds each command line argument to a corresponding `JobParameter`.
The `FileIngestTask` job processes the file given by the `JobParameter` named `localFilePath`.
Since there have not been any recent requests, the task launches within 30 seconds after the request is published (see the earlier tip about configuring the launch trigger).

#### Inspect Job Executions

To inspect job inspections, run the following command (shown with its output):

```bash
dataflow:>job execution list
╔═══╤═══════╤═════════╤════════════════════════════╤═════════════════════╤══════════════════╗
║ID │Task ID│Job Name │         Start Time         │Step Execution Count │Definition Status ║
╠═══╪═══════╪═════════╪════════════════════════════╪═════════════════════╪══════════════════╣
║1  │1      │ingestJob│Tue Jun 11 15:56:27 EDT 2019│1                    │Created           ║
╚═══╧═══════╧═════════╧════════════════════════════╧═════════════════════╧══════════════════╝
```

We can also list more details about that specific job execution:

```bash
dataflow:>job execution display --id 1
╔═══════════════════════════════════════╤════════════════════════════════════╗
║                  Key                  │               Value                ║
╠═══════════════════════════════════════╪════════════════════════════════════╣
║Job Execution Id                       │6                                   ║
║Task Execution Id                      │6                                   ║
║Task Instance Id                       │6                                   ║
║Job Name                               │ingestJob                           ║
║Create Time                            │Thu Jun 13 17:06:28 EDT 2019        ║
║Start Time                             │Thu Jun 13 17:06:29 EDT 2019        ║
║End Time                               │Thu Jun 13 17:06:57 EDT 2019        ║
║Running                                │false                               ║
║Stopping                               │false                               ║
║Step Execution Count                   │1                                   ║
║Execution Status                       │COMPLETED                           ║
║Exit Status                            │COMPLETED                           ║
║Exit Message                           │                                    ║
║Definition Status                      │Created                             ║
║Job Parameters                         │                                    ║
║-spring.cloud.task.executionid(STRING) │1                                   ║
║run.id(LONG)                           │1                                   ║
║localFilePath(STRING)                  │/var/scdf/shared-files/name-list.csv║
╚═══════════════════════════════════════╧════════════════════════════════════╝
```

#### Verify Data

When the the batch job runs, it processes the file in the local directory (`/var/scdf/shared-files`), transforms each item to uppercase names, and inserts it into the database.

Use [PivotalMySQLWeb](https://github.com/pivotal-cf/PivotalMySQLWeb) to inspect the data.

### Kubernetes

This section describes how to set up Spring Batch and Spring Cloud Data Flow on Kubernetes and then create our example batch process.

#### Prerequisites

This example assumes Data Flow is installed on Minikube with Kafka and MySQL. We recommend using the [Helm chart](%currentPath%/installation/kubernetes/helm). To get started, run the following command:

```bash
helm install --name my-release --set kafka.enabled=true,rabbitmq.enabled=false,server.service.type=NodePort stable/spring-cloud-data-flow
```

Running this example on Kubernetes requires configuring an NFS server and creating a corresponding `persistent volume` and `persistent volume claim` resources, as described in the [Kubernetes NFS Configuration](%currentPath%/recipes/batch/sftp-to-jdbc/#kubernetes-nfs-configuration) section.
We also require an external SFTP server with a `/remote-files` directory.

#### Register the Applications

If you downloaded the [sample project](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/recipes/file-ingest/file-to-jdbc/file-to-jdbc.zip?raw=true), you can build and publish the Docker image to the Minikube registry:

```bash
eval $(minikube docker-env)
./mvnw clean package docker:build -Pkubernetes
```

Otherwise, you can skip this step to pull the image from Dockerhub:

```bash
app register --name fileIngest --type task --uri docker://springcloud/ingest
```

Register the prepackaged `sftp` source and `task-launcher` sink applications:

```bash
app register --name sftp --type source  --uri docker://springcloudstream/sftp-dataflow-source-kafka:2.1.0.RELEASE --metadata-uri maven://org.springframework.cloud.stream.app:sftp-dataflow-source-kafka:jar:metadata:2.1.0.RELEASE
```

```bash
app register --name task-launcher --type sink --uri docker://springcloudstream/task-launcher-dataflow-sink-kafka:1.0.1.RELEASE --metadata-uri maven://org.springframework.cloud.stream.app:task-launcher-dataflow-sink-kafka:jar:metadata:1.0.1.RELEASE
```

#### Create the Task

To create the task, run the following command:

```bash
task create fileIngestTask --definition fileIngest
```

#### Create the Stream

The `sftp` source is configured to publish a task launch request to launch the `fileIngestTask` task.
The launch request mounts the NFS share to the task pod by using the
`deployer.*.kubernetes.volumes=[{'name':'staging','persistentVolumeClaim':{'claimName':'nfs-volume-claim'}}]` and
`deployer.*.kubernetes.volumeMounts=[{'mountPath':'/staging/shared-files','name':'staging'}]` deployment properties.

<!--NOTE-->

**NOTE**: Replace `<user>`, `<pass>`, and `<data-flow-server-uri>` in the following stream definition. The `<host>` value here is the default Minikube gateway for VirtualBox.

<!--END_NOTE-->

To get the `<data-flow-server-uri>` find the name of the service and use the `minikube service` command:

```bash:
kubectl get svc
...
my-release-data-flow-server     NodePort       10.97.74.123     <none>        80:30826/TCP

minikube service my-release-data-flow-server --url
http://192.168.99.105:30826
```

```bash
stream create inboundSftp --definition "sftp --host=192.168.99.1 --username=<user> --password=<pass> --allow-unknown-keys=true --remote-dir=/remote-files --local-dir=/staging/shared-files --task.launch.request.taskName=fileIngestTask --task.launch.request.deployment-properties=deployer.*.kubernetes.volumes=[{'name':'staging','persistentVolumeClaim':{'claimName':'nfs-volume-claim'}}],deployer.*.kubernetes.volumeMounts=[{'mountPath':'/staging/shared-files','name':'staging'}] | task-launcher --spring.cloud.dataflow.client.server-uri=<dataflow-uri>"
```

<!--TIP-->

The [dataflow-task-launcher-sink](https://github.com/spring-cloud-stream-app-starters/tasklauncher-dataflow/tree/master/spring-cloud-starter-stream-sink-task-launcher-dataflow) uses a [`PollableMessageSource`](https://docs.spring.io/spring-cloud-stream/docs/Elmhurst.BUILD-SNAPSHOT/api/org/springframework/cloud/stream/binder/PollableMessageSource.html) controlled by a dynamic trigger with exponential backoff. By default, the sink polls its input destination every second. If there are no task launch requests, the polling period continue to double, to a maximum of 30 seconds. If a task launch request is present, the trigger resets to one second. You can configure the trigger parameters by setting the `task-launcher` sink properties, `trigger.period` and `trigger.max-period`, in the stream definition.

<!--END_TIP-->

#### Deploy the Stream

When we deploy the stream, we must also configure a volume mount for the `sftp` source.

```bash
stream deploy inboundSftp --properties "deployer.sftp.kubernetes.volumes=[{'name':'staging','persistentVolumeClaim':{'claimName':'nfs-volume-claim'}}],deployer.sftp.kubernetes.volumeMounts=[{'mountPath':'/staging/shared-files','name':'staging'}]"
```

#### Verify Stream deployment

We can see the status of the streams to be deployed with `stream list`, as the following example shows:

```bash
dataflow:>stream list
╔═══════════╤═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╤════════════╗
║Stream Name│                                                                                                                  Stream Definition                                                                                                                  │   Status   ║
╠═══════════╪═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╪════════════╣
║inboundSftp│sftp                                                                                                                                                                                                                                                 │The stream  ║
║           │--task.launch.request.deployment-properties="deployer.*.kubernetes.volumes=[{'name':'staging','persistentVolumeClaim':{'claimName':'nfs-volume-claim'}}],deployer.*.kubernetes.volumeMounts=[{'mountPath':'/staging/shared-files','name':'staging'}]"│has been    ║
║           │--sftp.factory.password='******' --sftp.local-dir=/staging/shared-files --sftp.factory.allow-unknown-keys=true --sftp.factory.username='******' --sftp.remote-dir=/remote-files --sftp.factory.host=192.168.99.1                                     │successfully║
║           │--task.launch.request.taskName=fileIngestTask | task-launcher --spring.cloud.dataflow.client.server-uri=http://192.168.99.105:30826                                                                                                                  │deployed    ║
╚═══════════╧═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╧════════════╝
```

#### Inspect the Application Logs

Use `kubectl` to list the apps. The `source` and `sink` applications should be in a started state.

```bash
kubectl get pods
NAME                                             READY   STATUS    RESTARTS   AGE
...
inboundsftp-sftp-v12-6d55d469bd-t8znd            1/1     Running   0          6m24s
inboundsftp-task-launcher-v12-555d4785c5-zjr6b   1/1     Running   0          6m24s
...
```

The log files of the `sftp` source would be useful to debug issues such as SFTP connection failures and to verify SFTP downloads.

```bash
kubectl logs inboundsftp-sftp-v12-6d55d469bd-t8znd
```

The logs for the `task-launcher` application would be useful to debug data flow connection issues and verify task launch requests:

```bash
kubectl logs inboundsftp-task-launcher-v12-555d4785c5-zjr6b
```

#### Copy a File into the Remote Directory

You can find sample data in the `data/` directory of the [sample project](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/recipes/file-ingest/file-to-jdbc/file-to-jdbc.zip?raw=true).

Connect to the SFTP server and upload `data/name-list.csv` into the `remote-files` directory:

When this file is detected, the `sftp` source downloads it to the `/var/scdf/shared-files` directory specified by `--local-dir`. We use the `/var/scdf` shared mount path that we configured for the `nfs` service. When the file is downloaded, the source emits a task launch request.
The task launch request includes the name of the task to launch, along with the local file path, given as a command line argument.
Spring Batch binds each command line argument to a corresponding `JobParameter`.
The `FileIngestTask` job processes the file given by the `JobParameter` named `localFilePath`.
Since there have not been any recent requests, the task launches within 30 seconds after the request is published (see the earlier tip about configuring the launch trigger).

#### Inspect Job Executions

To inspect job executions, run the following command (shown with its output):

```bash
dataflow:>job execution list
╔═══╤═══════╤═════════╤════════════════════════════╤═════════════════════╤══════════════════╗
║ID │Task ID│Job Name │         Start Time         │Step Execution Count │Definition Status ║
╠═══╪═══════╪═════════╪════════════════════════════╪═════════════════════╪══════════════════╣
║1  │1      │ingestJob│Thu Jun 13 08:39:59 EDT 2019│1                    │Created           ║
╚═══╧═══════╧═════════╧════════════════════════════╧═════════════════════╧══════════════════╝
```

We can also list more details about that specific job execution:

```bash
dataflow:>job execution display --id 1
╔═══════════════════════════════════════════╤═══════════════════════════════════╗
║                    Key                    │               Value               ║
╠═══════════════════════════════════════════╪═══════════════════════════════════╣
║Job Execution Id                           │1                                  ║
║Task Execution Id                          │424                                ║
║Task Instance Id                           │1                                  ║
║Job Name                                   │ingestJob                          ║
║Create Time                                │Thu Jun 13 08:39:59 EDT 2019       ║
║Start Time                                 │Thu Jun 13 08:39:59 EDT 2019       ║
║End Time                                   │Thu Jun 13 08:40:07 EDT 2019       ║
║Running                                    │false                              ║
║Stopping                                   │false                              ║
║Step Execution Count                       │1                                  ║
║Execution Status                           │COMPLETED                          ║
║Exit Status                                │COMPLETED                          ║
║Exit Message                               │                                   ║
║Definition Status                          │Created                            ║
║Job Parameters                             │                                   ║
║-spring.cloud.task.executionid(STRING)     │424                                ║
║run.id(LONG)                               │1                                  ║
║-spring.datasource.username(STRING)        │******                             ║
║-spring.cloud.task.name(STRING)            │fileIngestTask                     ║
║-spring.datasource.password(STRING)        │******                             ║
║-spring.datasource.driverClassName(STRING) │org.mariadb.jdbc.Driver            ║
║localFilePath(STRING)                      │/staging/shared-files/name-list.csv║
║-spring.datasource.url(STRING)             │******                             ║
╚═══════════════════════════════════════════╧═══════════════════════════════════╝
```

#### Verify Data

When the the batch job runs, it processes the file in the local directory (`/staging/shared-files`), transforms each item to uppercase names, and inserts it into the database.

Open a shell in the `mysql` container to query the `people` table:

```bash
kubectl get pods
...
my-release-mysql-56f988dd6c-qlm8q                1/1     Running
...
```

<!-- Rolling my own to disable erroneous formating -->
<div class="gatsby-highlight" data-language="bash">
<pre class="language-bash"><code>kubectl exec -it my-release-mysql-56f988dd6c-qlm8q -- /bin/bash
# mysql -u root -p$MYSQL_ROOT_PASSWORD
mysql&gt; select * from dataflow.people;
</code></pre></div>

```
+-----------+------------+-----------+
| person_id | first_name | last_name |
+-----------+------------+-----------+
|         1 | AARON      | AABERG    |
|         2 | AARON      | AABY      |
|         3 | ABBEY      | AADLAND   |
|         4 | ABBIE      | AAGAARD   |
|         5 | ABBY       | AAKRE     |
|         6 | ABDUL      | AALAND    |
|         7 | ABE        | AALBERS   |
|         8 | ABEL       | AALDERINK |
|         9 | ABIGAIL    | AALUND    |
|        10 | ABRAHAM    | AAMODT    |
|      ...                           |
+-----------+------------+-----------+
```

## Limiting Concurrent Task Executions

This recipe processes a single file with 5000+ items. What if we copy 100 files into the remote directory?
The `sftp` source processes them immediately, generating 100 task launch requests. The Dataflow Server launches tasks asynchronously, so this could potentially overwhelm the resources of the runtime platform.
For example, when running the Data Flow server on your local machine, each launched task creates a new JVM. In Cloud Foundry, each task creates a new container instance, and, in Kubernetes, a pod.

Fortunately, Spring Cloud Data Flow provides configuration settings to [limit the number of concurrently running tasks](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#spring-cloud-dataflow-task-limit-concurrent-executions).

We can use this sample to see how this works.

### Lower the Maximum Concurrent Task Executions

The sample project includes twenty files in the `data/spilt` directory. To observe the limit in action, we can set the maximum concurrent tasks to 3.

For running tasks on a local server, restart the server and add the following command line argument: `spring.cloud.dataflow.task.platform.local.accounts[default].maximum-concurrent-tasks=3`.

If your process runs on Cloud Foundry, run the following command:

```bash
cf set-env <dataflow-server> SPRING_CLOUD_DATAFLOW_TASK_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[DEFAULT]_DEPLOYMENT_MAXIMUMCONCURRENTTASKS 3
```

If your process runs on Kubernetes, edit the Data Flow server `configmap`, by running the following command:

```
kubectl edit configmap my-release-data-flow-server
```

Add the `maximum-concurrent-tasks` property, as follows:

```yaml
apiVersion: v1
data:
  application.yaml: |-
    spring:
      cloud:
        dataflow:
          task:
            platform:
              kubernetes:
                accounts:
                  default:
                    maximum-concurrent-tasks: 3
                    limits:
                      memory: 1024Mi
                      cpu: 500m
```

After editing the `configmap`, delete the Data Flow server pod to force it to restart. Then wait for it to restart.

### Verify that the Maximum Concurrent Task Executions is Enforced

The task launcher sink polls the input destination. The polling period adjusts according to the presence of task launch requests and also to the number of currently running tasks reported through the Data Flow server's `tasks/executions/current` REST endpoint.
The sink queries this endpoint and pauses polling the input for new requests if the number of concurrent tasks for the task platform is at its limit.
This introduces a 1-30 second lag between the creation of the task launch request and the execution of the request, sacrificing some performance for resilience.
Task launch requests are never sent to a dead letter queue because the server is busy or unavailable.
The exponential backoff also prevents the app from querying the server excessively when there are no task launch requests.

### Monitor the Task Executions

Tail the `task-launcher` container logs.

You can also monitor the Data Flow server for current task executions:

```bash
watch curl <dataflow-server-url>/tasks/executions/current
Every 2.0s: curl http://192.168.99.105:30826/tasks/executions/current

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0100    92    0    92    0     0   1202      0 --:--:-- --:--:-- --:--:
--  1210
[{"name":"default","type":"Kubernetes","maximumTaskExecutions":3,"runningExecutionCount":0}]
```

### Run the Sample with Multiple Files

With the sample stream deployed, upload the twenty files in `data/spilt` to `/remote-files` files. In the `task-launcher` logs, you should see the exponential backoff working:

```
2019-06-14 15:00:48.247  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Polling period reset to 1000 ms.
2019-06-14 15:00:49.265  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Launching Task fileIngestTask on platform default
2019-06-14 15:00:50.433  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Launching Task fileIngestTask on platform default
2019-06-14 15:00:51.686  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Launching Task fileIngestTask on platform default
2019-06-14 15:00:52.929  WARN 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : The data Flow task platform default has reached its concurrent task execution limit: (3)
2019-06-14 15:00:52.929  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Polling paused- increasing polling period to 2 seconds.
2019-06-14 15:00:55.008  WARN 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : The data Flow task platform default has reached its concurrent task execution limit: (3)
2019-06-14 15:00:55.008  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Polling paused- increasing polling period to 4 seconds.
2019-06-14 15:00:59.039  WARN 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : The data Flow task platform default has reached its concurrent task execution limit: (3)
2019-06-14 15:00:59.040  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Polling paused- increasing polling period to 8 seconds.
2019-06-14 15:01:07.104  WARN 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : The data Flow task platform default has reached its concurrent task execution limit: (3)
2019-06-14 15:01:07.104  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Polling paused- increasing polling period to 16 seconds.
2019-06-14 15:01:23.127  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Polling resumed
2019-06-14 15:01:23.128  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Launching Task fileIngestTask on platform default
2019-06-14 15:01:23.232  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Polling period reset to 1000 ms.
2019-06-14 15:01:24.277  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Launching Task fileIngestTask on platform default
2019-06-14 15:01:25.483  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Launching Task fileIngestTask on platform default
2019-06-14 15:01:26.743  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Launching Task fileIngestTask on platform default
2019-06-14 15:01:28.035  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Launching Task fileIngestTask on platform default
2019-06-14 15:01:29.324  WARN 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : The data Flow task platform default has reached its concurrent task execution limit: (3)
2019-06-14 15:01:29.325  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Polling paused- increasing polling period to 2 seconds.
2019-06-14 15:01:31.435  WARN 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : The data Flow task platform default has reached its concurrent task execution limit: (3)
2019-06-14 15:01:31.436  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Polling paused- increasing polling period to 4 seconds.
2019-06-14 15:01:35.531  WARN 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : The data Flow task platform default has reached its concurrent task execution limit: (3)
2019-06-14 15:01:35.532  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Polling paused- increasing polling period to 8 seconds.
2019-06-14 15:01:43.615  WARN 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : The data Flow task platform default has reached its concurrent task execution limit: (3)
2019-06-14 15:01:43.615  INFO 1 --- [pool-2-thread-1] o.s.c.s.a.t.l.d.s.LaunchRequestConsumer  : Polling paused- increasing polling period to 16 seconds.
```

## Avoiding Duplicate Processing

The `sftp` source does not process files that it has already seen.
It uses a [Metadata Store](https://docs.spring.io/spring-integration/docs/current/reference/html/#jdbc-metadata-store) to keep track of files by extracting content from messages at runtime.
Out of the box, it uses an in-memory metadata store, but it is pluggable to a persistent store that is useful for production deployments.
Thus, if we re-deploy the stream or restart the `sftp` source, this state is lost and files are reprocessed.

Thanks to the magic of Spring, we can auto-configure one of the available persistent Metadata Stores to prevent duplicate processing.

In this example, we [auto configure the JDBC metadata store](https://github.com/spring-cloud-stream-app-starters/core/tree/master/common/stream-apps-metadata-store-common#jdbc), since we are already using a JDBC database.

### Configure and Build the SFTP Source

For this purpose, we add some JDBC dependencies to the `sftp-dataflow` source.

Clone the [sftp]https://github.com/spring-cloud-stream-app-starters/sftp stream app starter.
Change directory to the SFTP directory.
In the following command, replace `<binder>` with `kafka` or `rabbit` as appropriate for your configuration and run the command:

```bash
./mvnw clean install -DskipTests -PgenerateApps
cd apps/sftp-dataflow-source-<binder>
```

Add the following dependencies to `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.integration</groupId>
    <artifactId>spring-integration-jdbc</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
</dependency>
```

If you run on Kubernetes, use the mariadb driver instead of H2:

```xml
<dependency>
    <groupId>org.mariadb.jdbc</groupId>
    <artifactId>mariadb-java-client</artifactId>
    <version>2.3.0</version>
</dependency>
```

If you run on a local server with the in-memory H2 database, set the JDBC URL in `src/main/resources/application.properties` to use the Data Flow server's database:

```
spring.datasource.url=jdbc:h2:tcp://localhost:19092/mem:dataflow
```

If you run on Kubernetes, set the datasource to use the internal IP of the `mysql` service, as the following example shows:

```
spring.datasource.url=jdbc:mysql://10.98.214.235:3306/dataflow
```

If you run in Cloud Foundry or Kubernetes, add the following property to `src/main/resources/application.properties`:

```
spring.integration.jdbc.initialize-schema=always
```

Build the `sftp` source and register it with Data Flow.

### Run the Sample App

Follow the instructions for running the sample on your preferred platform, up to the `Copy file...` step.

If you have already completed the main exercise, restore the data to its initial state and redeploy the stream:

1. Clean the local and remote data directories.
1. Run the `DROP TABLE PEOPLE;` SQL command in the database.
1. Undeploy the stream and deploy it again to run the updated `sftp` source.

If you run in Cloud Foundry, set the deployment properties to bind `sftp` to the `mysql` service, as the following example shows:

```bash
dataflow>stream deploy inboundSftp --properties "deployer.sftp.cloudfoundry.services=nfs,mysql"
```

### Copy a File into the Remote Directory

We use one small file for this.
The `data/split` directory in the sample project contains the contents of
`data/name-list.csv` split into 20 files. Upload `names_aa.csv`:

### Inspect the Database

By using a database tool, as described earlier, view the contents of the `INT_METADATA_STORE` table. The following image shows the result:

![JDBC Metadata Store](images/metadata_store_1.png)

Note that there is a single key-value pair, where the key identifies the file name (the `sftpSource/` prefix provides a namespace for the `sftp` source app). The value is a timestamp indicating when the message was received.
The metadata store tracks files that have already been processed.
This prevents the same files from being pulled from the remote directory on every polling cycle.
Only new files or files that have been updated are processed.

Since there are no uniqueness constraints on the `PEOPLE` table, a file being processed multiple times by our batch job results in duplicate table rows. Since we have configured a persistent metadata store, duplicate processing is prevented across container restarts. You can verify this by undeploying and redeploying the stream or by restarting the `sftp` source.

If we view the `PEOPLE` table, it should look something like this:

![People table](images/people_table_1.png)

Now we can upload the same file to the SFTP server. If you are logged into it, you can update the timestamp, as follows:

```bash
touch /remote-files/names_aa.csv
```

Now the file is reprocessed and the `PEOPLE` table contains duplicate data. If you `ORDER BY FIRST_NAME`, you see something like this:

![People table with duplicates](images/people_table_2.png)

If we drop another one of files into the remote directory, that is processed, and we see another entry in the Metadata Store.
