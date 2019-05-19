---
path: 'installation/cloudfoundry/cf-local'
title: 'Running locally'
description: 'Configure the local servers to deploy to Cloud Foundry'
---

# Running locally Cloud Foundry

Sometimes for debugging purposes it is convenient to run the Data Flow and Skipper server on your local machine and configure it to deploy applications to Cloud Foundry.

## Configure Data Flow Server on Local Machine

To run the server application locally (on your laptop or desktop) and target your Cloud Foundry installation, you can configure the Data Flow server by setting the following environment variables in a property file (for example, `myproject.properties`):

```properties
spring.profiles.active=cloud
jbp.config.spring.auto.reconfiguration='{enabled: false}'
spring.cloud.dataflow.task.platform.cloudfoundry.accounts[default].connection.url=https://api.run.pivotal.io
spring.cloud.dataflow.task.platform.cloudfoundry.accounts[default].connection.org={org}
spring.cloud.dataflow.task.platform.cloudfoundry.accounts[default].connection.space={space}
spring.cloud.dataflow.task.platform.cloudfoundry.accounts[default].connection.domain=cfapps.io
spring.cloud.dataflow.task.platform.cloudfoundry.accounts[default].connection.username={email}
spring.cloud.dataflow.task.platform.cloudfoundry.accounts[default].connection.password={password}
spring.cloud.dataflow.task.platform.cloudfoundry.accounts[default].connection.skipSslValidation=false

# The following command lets task applications write to their DB.
# Note, however, that when the *server* runs locally, it cannot access that DB.
# In that case, task-related commands that show executions do not work.
spring.cloud.dataflow.task.platform.cloudfoundry.accounts[default].deployment.services=mysqlcups
skipper.client.serverUri=https://<skipper-host-name>/api
```

You need to fill in `\{org}`, `\{space}`, `\{email}`, and `\{password}` before using the file in the following command.

<!--WARNING-->

**SSL Validation**

Set _Skip SSL Validation_ to true only if you run on a Cloud Foundry
instance by using self-signed certificates (for example, in
development). Do not use self-signed certificates for production.

<!--END_WARNING-->

<!--TIP-->

You must deploy Skipper first and then configure the URI location of where the Skipper server is running.

<!--END_TIP-->

Now you are ready to start the server application, as follows:

```bash
java -jar spring-cloud-dataflow-server-%dataflow-version%.jar --spring.config.additional-location=<PATH-TO-FILE>/foo.properties
```

## Configure Skipper Server on Local Machine

To run the Skipper application locally (on your laptop or desktop) and target your Cloud Foundry installation, you can configure the Skipper server by setting the following environment variables in a property file (for example, `myproject.properties`):

```properties
spring.profiles.active=cloud
jbp.config.spring.auto.reconfiguration='{enabled: false}'
spring.cloud.skipper.server.platform.cloudfoundry.accounts[default].connection.url=https://api.run.pivotal.io
spring.cloud.skipper.server.platform.cloudfoundry.accounts[default].connection.org={org}
spring.cloud.skipper.server.platform.cloudfoundry.accounts[default].connection.space={space}
spring.cloud.skipper.server.platform.cloudfoundry.accounts[default].connection.domain=cfapps.io
spring.cloud.skipper.server.platform.cloudfoundry.accounts[default].connection.username={email}
spring.cloud.skipper.server.platform.cloudfoundry.accounts[default].connection.password={password}
spring.cloud.skipper.server.platform.cloudfoundry.accounts[default].connection.skipSslValidation=false
```

You need to fill in `\{org}`, `\{space}`, `\{email}`, and `\{password}` before using the file in the following command.

<!--WARNING-->

**SSL Validation**

Set _Skip SSL Validation_ to true only if you run on a Cloud Foundry
instance by using self-signed certificates (for example, in
development). Do not use self-signed certificates for production.

<!--END_WARNING-->
