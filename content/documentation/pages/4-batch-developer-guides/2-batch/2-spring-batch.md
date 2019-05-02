---
path: 'batch-developer-guides/batch/spring-batch/'
title: 'Spring Batch Jobs'
description: 'Create a Spring Batch Job'
---

# Batch Processing with Spring Batch

In this guide we will develop a Spring Batch application and deploy it to Cloud Foundry, Kubernetes, and on your local machine. In another guide, we will deploy the [Spring Batch application using Data Flow](%currentPath%/batch-developer-guides/batch/data-flow-spring-batch/).

The following sections describe how to build this application from scratch. If you prefer, you can download a zip file containing the sources for the application `billrun`, unzip it, and proceed to the [deployment](#deployment) step.

You can can [download the project](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/batch-developer-guides/batch/batchsamples/dist/batchsamples.zip?raw=true) from your browser, or from the command-line:

```bash
wget https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/batch-developer-guides/batch/batchsamples/dist/batchsamples.zip?raw=true -O batchsamples.zip
```

## Development

We will start from [Spring Initializr](https://start.spring.io/) and create a Spring Batch application.

Suppose a cell phone data provider needs to create billing statements for customers. The usage data is stored in JSON files that are stored on the file system. The billing solution must pull data from these files, generate the billing data from this usage data, and store it in a `BILL_STATEMENTS` table.

We could implement this entire solution into a single Spring Boot Application that utilizes Spring Batch, however for this example we will break up the solution into 2 phases:

1. [billsetuptask](%currentPath%/batch-developer-guides/batch/simple-task/): The [billsetuptask](%currentPath%/batch-developer-guides/batch/simple-task/) application will be a Spring Boot application using Spring Cloud Task that will simply create the `BILL_STATEMENTS` table.
1. _billrun_: The _billrun_ application will be a Spring Boot application using Spring Cloud Task and Spring Batch that will read usage data from a JSON file and price the each row and put the resulting data into the `BILL_STATEMENTS` table.

For this section we will create a Spring Cloud Task/Spring Batch billrun application that will read usage information from a JSON file containing customer usage data and price each entry and place the result into the `BILL_STATEMENTS` table.

![BILL_STATMENTS](images/bill_statements.png)

### Intoducing Spring Batch

Spring Batch is a lightweight, comprehensive batch framework designed to enable the development of robust batch applications. Spring Batch provides reusable functions that are essential in processing large volumes of records by offering features such as:

- Logging/tracing
- Chunk based processing
- Declarative I/O
- Start/Stop/Restart
- Retry/Skip
- Resource management

It also provides more advanced technical services and features that will enable extremely high-volume and high performance batch jobs through optimization and partitioning techniques.

For this guide we will focus on 5 Spring Batch components:

![BILL_STATMENTS](images/spring-batch-reference-model.png)

- `Job`: A `job` is an entity that encapsulates an entire batch process. A job is comprised of one or more `steps`.
- `Step`: A `Step` is a domain object that encapsulates an independent, sequential phase of a batch job. Each `step` is comprised of a `ItemReader`, `ItemProcessor`, and a `ItemWriter`.
- `ItemReader`: `ItemReader` is an abstraction that represents the retrieval of input for a Step, one item at a time.
- `ItemProcessor`: `ItemProcessor` is an abstraction that represents the business processing of an item.
- `ItemWriter`: `ItemWriter` is an abstraction that represents the output of a Step

In the diagram above we see that each phase of the `JobExecution` is stored into a `JobRepository` (our MySql database). This means that each action performed by Spring Batch is recorded to a database for both logging purposes but also for restarting a job.

NOTE: You can read more about this process [here](https://docs.spring.io/spring-batch/4.0.x/reference/html/domain.html#domainLanguageOfBatch).

### Our Batch Job

So for our application we will have a BillRun `Job` that will have one `Step` that will comprised of:

- `JsonItemReader`: Is an `ItemReader` that will read a JSON file containing the usage data.
- `BillProcessor`: Is an `ItemProcessor` that will generate a price based on each row of data sent from the JsonItemReader.
- `JdbcBatchItemWriter`: Is an `ItemWriter` that will write the priced Bill record to the `BILLING_STATEMENT` table.

### Initialzr

1. Visit the [Spring Initialzr site](https://start.spring.io/).
1. Select the latest release of spring boot.
1. Create a new Maven project with a Group name of `io.spring` and an Artifact name of `billrun`.
1. In the Dependencies text box, type `task` to select the Cloud Task dependency.
1. In the Dependencies text box, type `jdbc` then select the JDBC dependency.
1. In the Dependencies text box, type `h2` then select the H2 dependency.
   1. We use H2 for unit testing.
1. In the Dependencies text box, type `mysql` then select mysql dependency (or your favorite database).
   1. We use MySql for the runtime database.
1. In the Dependencies text box, type `batch` then select Batch.
1. Click the Generate Project button.
1. Unzip the billrun.zip file and import the project into your favorite IDE.

Another option instead of using the UI to initialize your project you can do the following:

1. Click the [here](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&baseDir=billrun&groupId=io.spring&artifactId=billrun&name=Bill+Run&description=Bill+Run+Sample+App&packageName=io.spring.billrun&packaging=jar&inputSearch=&style=batch&style=cloud-task&style=jdbc&style=h2&style=mysql) to download the preconfigured billrun.zip.

2. Unzip the billrun.zip file and import the project into your favorite IDE

### Setting up MySql

1. If you don't have an instance of MySql available to you, you can follow these instructions to run a MySql docker image for this example.

   1. Pull the MySql docker image

      ```bash
      $ docker pull mysql:5.7.25
      ```

   2. Start the MySql

   ```bash
   $ docker run -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=password \
   -e MYSQL_DATABASE=task -d mysql:5.7.25
   ```

### Biz Logic

1.  Download the `download: https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow-samples/master/dataflow-website/batch-developer-guides/batch/batchsamples/billrun/src/main/resources/usageinfo.json title=usageinfo.json` and copy it to the /src/main/resources directory.

1.  Download the `download: https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow-samples/master/dataflow-website/batch-developer-guides/batch/batchsamples/billrun/src/main/resources/schema.sql title=schema.sql` and copy it to the /src/main/resources directory.

1.  In your favorite IDE create the `io.spring.billrun.model` package
1.  Create a `Usage` class in the `io.spring.billrun.model` using your favorite IDE that looks like the contents in [Usage.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-website/batch-developer-guides/batch/batchsamples/billrun/src/main/java/io/spring/billrun/model/Usage.java).

1.  Create a `Bill` class in the `io.spring.billrun.model` using your favorite IDE that looks like the contents in [Bill.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-website/batch-developer-guides/batch/batchsamples/billrun/src/main/java/io/spring/billrun/model/Bill.java).

1.  In your favorite IDE create the `io.spring.billrun.configuration` package

1.  Now lets create our `ItemProcessor` for pricing each Usage record. Create a [BillProcessor](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-website/batch-developer-guides/batch/batchsamples/billrun/src/main/java/io/spring/billrun/configuration/BillProcessor.java) class in the `io.spring.billrun.configuration` using your favorite IDE that looks like the contents below.

    ```java
    public class BillProcessor implements ItemProcessor<Usage, Bill> {

      @Override
      public Bill process(Usage usage) {
         Double billAmount = usage.getDataUsage() * .001 + usage.getMinutes() * .01;
         return new Bill(usage.getId(), usage.getFirstName(), usage.getLastName(),
               usage.getDataUsage(), usage.getMinutes(), billAmount);
      }
    }
    ```

    Notice that we are implementing the `ItemProcessor` interface that has the `process` method that we need to override.
    Our parameter is a `Usage` object and the return value is of type `Bill`.

1.  Now we will create a Java configuration that will specify the beans required for the BillRun `Job`. In this case create a [BillingConfiguration](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-website/batch-developer-guides/batch/batchsamples/billrun/src/main/java/io/spring/billrun/configuration/BillingConfiguration.java) class in the `io.spring.billrun.configuration` using your favorite IDE that looks like the contents below.

    ```java
    @Configuration
    @EnableTask
    @EnableBatchProcessing
    public class BillingConfiguration {
      @Autowired
      public JobBuilderFactory jobBuilderFactory;

      @Autowired
      public StepBuilderFactory stepBuilderFactory;

      @Value("${usage.file.name:classpath:usageinfo.json}")
      private Resource usageResource;

      @Bean
      public Job job1(ItemReader<Usage> reader,
        ItemProcessor<Usage,Bill> itemProcessor, ItemWriter<Bill> writer) {
          Step step = stepBuilderFactory.get("BillProcessing")
                  .<Usage, Bill>chunk(1)
                  .reader(reader)
                  .processor(itemProcessor)
                  .writer(writer)
                  .build();

          return jobBuilderFactory.get("BillJob")
                  .incrementer(new RunIdIncrementer())
                  .start(step)
                  .build();
      }

      @Bean
      public JsonItemReader<Usage> jsonItemReader() {

          ObjectMapper objectMapper = new ObjectMapper();
          JacksonJsonObjectReader<Usage> jsonObjectReader =
                  new JacksonJsonObjectReader<>(Usage.class);
          jsonObjectReader.setMapper(objectMapper);

          return new JsonItemReaderBuilder<Usage>()
                  .jsonObjectReader(jsonObjectReader)
                  .resource(usageResource)
                  .name("UsageJsonItemReader")
                  .build();
      }

      @Bean
      public ItemWriter<Bill> jdbcBillWriter(DataSource dataSource) {
          JdbcBatchItemWriter<Bill> writer = new JdbcBatchItemWriterBuilder<Bill>()
                          .beanMapped()
                  .dataSource(dataSource)
                  .sql("INSERT INTO BILL_STATEMENTS (id, first_name, " +
                     "last_name, minutes, data_usage,bill_amount) VALUES " +
                     "(:id, :firstName, :lastName, :minutes, :dataUsage, " +
                     ":billAmount)")
                  .build();
          return writer;
      }

      @Bean
      ItemProcessor<Usage, Bill> billProcessor() {
          return new BillProcessor();
      }
    }
    ```

    Before moving on let's look at our configuration a little bit.
    The `@EnableBatchProcessing` annotation enables Spring Batch features and provide a base configuration for setting up batch jobs.
    The `@EnableTask` annotation sets up a TaskRepository which stores information about the task execution such as the start and end time of the task and the exit code.
    In the configuration above we see that our `ItemReader` bean is an instance of `JsonItemReader`. The `JsonItemReader` will read the contents of a resource and unmarshall the JSON data into Usage objects. The `JsonItemReader` is one of the `ItemReader`s provided by Spring Batch.
    We also see that our `ItemWriter` bean is an instance of `JdbcBatchItemWriter`. The `JdbcBatchItemWriter` will write the results to our database. The `JdbcBatchItemWriter` is one of the `ItemWriter`s provided by Spring Batch.
    And the `ItemProcessor` is our very own `BillProcessor`. To make life easier notice that all the beans that use Spring Batch provided classes (`Job`, `Step`, `ItemReader`, `ItemWriter`) are being built using builders provided by Spring Batch.

### Testing

Now that we have written our code, its time to write our test. In this case we want to make sure that the bill information has been properly inserted into the `BILLING_STATEMENTS` table.
Let’s create our test. Update the [BillrunApplicationTests.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/batch-developer-guides/batch/batchsamples/billrun/src/test/java/io/spring/billrun/BillrunApplicationTests.java) such that looks like the contents below.

```java
package io.spring.billrun;

import java.util.List;

import io.spring.billrun.model.Bill;
import javax.sql.DataSource;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.springframework.batch.test.context.SpringBatchTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
@SpringBatchTest
public class BillrunApplicationTests {

	@Autowired
	private DataSource dataSource;

	private JdbcTemplate jdbcTemplate;

	@Before
	public void setup()  {
		this.jdbcTemplate = new JdbcTemplate(this.dataSource);
	}

	@Test
	public void testJobResults() {
		testResult();
	}

	private void testResult() {
		List<Bill> billStatements = this.jdbcTemplate.query("select id, " +
						"first_name, last_name, minutes, data_usage, bill_amount " +
						"FROM bill_statements ORDER BY id",
				(rs, rowNum) -> new Bill(rs.getLong("id"),
						rs.getString("FIRST_NAME"), rs.getString("LAST_NAME"),
						rs.getLong("DATA_USAGE"), rs.getLong("MINUTES"),
						rs.getDouble("bill_amount")));
		Assert.assertEquals(5, billStatements.size());

		Bill billStatement = billStatements.get(0);
		Assert.assertEquals(6, billStatement.getBillAmount(), 1e-15);
		Assert.assertEquals("jane", billStatement.getFirstName());
		Assert.assertEquals("doe", billStatement.getLastName());
		Assert.assertEquals(new Long(1), billStatement.getId());
		Assert.assertEquals(new Long(500), billStatement.getMinutes());
		Assert.assertEquals(new Long(1000), billStatement.getDataUsage());
	}
}
```

For this test we will use `JdbcTemplate` to execute a query to retrieve the results of the billrun. Once the query has been executed we verify that the data in the table is what we expect.

## Deployment

Deploy to local, Cloud Foundry and Kubernetes

### Local

1.  Now let’s take the next step of building the project.
    From a command line change directory to the location of your project and build the project using maven:
    `./mvnw clean package`.

2.  Now let’s execute the application with the configurations required to process the usage information in the database.

    To configure the execution of the billrun application utilize the following arguments:

    1. _spring.datasource.url_ - set the URL to your database instance. In the sample below we are connecting to a mysql `task` database on our local machine at port 3306.
    1. _spring.datasource.username_ - the user name to be used for the MySql database. In the sample below it is `root`
    1. _spring.datasource.password_ - the password to be used for the MySql database. In the sample below it is `password`
    1. _spring.datasource.driverClassName_ - The driver to use to connect to the MySql database. In the sample below it is `com.mysql.jdbc.Driver`
    1. _spring.datasource.initialization-mode_ - initializes the database with the BILL_STATEMENTS and BILL_USAGE tables required for this app. In the sample below we state that we `always` want to do this. This will not overwrite the tables if they already exist.
    1. _spring.batch.initialize-schema_ - initializes the database with the tables required for Spring Batch. In the sample below we state that we `always` want to do this. This will not overwrite the tables if they already exist.

    ```bash
    $ java -jar target/billrun-0.0.1-SNAPSHOT.jar \
    --spring.datasource.url=jdbc:mysql://localhost:3306/task?useSSL=false \
    --spring.datasource.username=root \
    --spring.datasource.password=password \
    --spring.datasource.driverClassName=com.mysql.jdbc.Driver \
    --spring.datasource.initialization-mode=always \
    --spring.batch.initialize-schema=always
    ```

3.  Log in to the `mysql` container to query the `BILL_STATEMENTS` table.

<!-- Rolling my own to disable erroneous formating -->
<div class="gatsby-highlight" data-language="bash">
<pre class="language-bash"><code>$ docker exec -it mysql bash -l
# mysql -u root -ppassword
mysql&gt; select * from task.BILL_STATEMENTS;
</code></pre></div>

The output should look something like:

| id  | first_name | last_name | minutes | data_usage | bill_amount |
| --- | ---------- | --------- | ------- | ---------- | ----------- |
| 1   | jane       | doe       | 500     | 1000       | 6.00        |
| 2   | john       | doe       | 550     | 1500       | 7.00        |
| 3   | melissa    | smith     | 600     | 1550       | 7.55        |
| 4   | michael    | smith     | 650     | 1500       | 8.00        |
| 5   | mary       | jones     | 700     | 1500       | 8.50        |

#### Cleanup

To stop and remove the mysql container running in the docker instance:

```bash
$ docker stop mysql
$ docker rm mysql
```

### Cloud Foundry

This guide will walk through how to deploy and run simple [spring-batch](https://spring.io/projects/spring-batch) stand-alone applications to Cloud Foundry.

#### Requirements

On your local machine, you will need to have installed:

- Java
- [Git](https://git-scm.com/)

Please also make sure that you have the [Cloud Foundry command line interface](https://console.run.pivotal.io/tools) installed ([documentation](https://docs.run.pivotal.io/cf-cli/)).

#### Building the application

Now let’s take the next step of building the project.
From a command line change directory to the location of your project and build the project using maven
`./mvnw clean package`

#### Setting up Cloud Foundry

First of all you need a Cloud Foundry account. You can create a free account using [Pivotal Web Services](https://run.pivotal.io/) (PWS). We will use PWS for this example. If you use a different provider, your experience may vary slightly.

Log into Cloud Foundry using the [Cloud Foundry command line interface](https://console.run.pivotal.io/tools):

```bash
cf login
```

**INFO** You can also target specific Cloud Foundry instances with the `-a` flag, for example `cf login -a https://api.run.pivotal.io`.

Before you can push the application, please also ensure that you setup the **MySql Service** on Cloud Foundry. You can check what services are available using:

```bash
cf marketplace
```

On [Pivotal Web Services](https://run.pivotal.io/) (PWS) you should be able to use the following command to install the MySQL service:

```bash
cf create-service cleardb spark task-example-mysql
```

Please make sure you name your MySQL service is `task-example-mysql`.

#### Task Concepts in Cloud Foundry

In order to provide configuration parameters for Cloud Foundry, we will create dedicated `manifest` YAML files for each application.

**INFO** For additional information on setting up a manifest see [here](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html)

Running tasks on Cloud Foundry is a 2-stage process. Before you can actually run any tasks you need to first push an app that is staged without any running instances. We are providing the following common properties to the manifest YAML file to each application:

```yml
memory: 32M
health-check-type: process
no-route: true
instances: 0
```

The key is to set the `instances` property to `0`. This will ensure that the app is staged without being actually running. We also do not need a route to be created and can set `no-route` to `true`.

**TIP** Having this app staged but not running has a second advantage as well. Not only do we need this staged application to run a task in a subsequent step, but if your database service is internal (part of your Cloud Foundry instance) we can use this application to establish an SSH tunnel to the associated MySql database service to see the persisted data. But we go into the details for that a little bit further down below.

#### Running billrun on Cloud Foundry

Now we will deploy and run the second task application. In order to deploy, create file `manifest-billrun.yml`:

```yaml
applications:
  - name: billrun
    memory: 32M
    health-check-type: process
    no-route: true
    instances: 0
    disk_quota: 1G
    timeout: 180
    buildpacks:
      - java_buildpack
    path: target/billrun-0.0.1-SNAPSHOT.jar
    services:
      - task-example-mysql
```

Now run `cf push -f ./manifest-billrun.yml`. This will stage the application. We are now ready to run the task:

```bash
cf run-task billrun ".java-buildpack/open_jdk_jre/bin/java org.springframework.boot.loader.JarLauncher arg1" --name billrun-task
```

This should produce output like the following:

```bash
Task has been submitted successfully for execution.
task name:   billrun-task
task id:     1
```

Verifying the task on the Cloud Foundry dashboard, the task should have executed successfully. But how do we verify that the task application successfuly populated the database table?

#### Validating the Database Results

There are multiple options available on how to access database data in Cloud Foundry also depending on your individual Cloud Foundry environment. Two options that we will look at are:

- Using local tools (via SSH or external database provider)
- Using a Database GUI deployed to Cloud Foundry

##### Using local tools (MySQLWorkbench)

First we need to create a [key for a service instance](http://cli.cloudfoundry.org/en-US/cf/create-service-key.html) using the `cf create-service-key` command:

```bash
cf create-service-key task-example-mysql EXTERNAL-ACCESS-KEY
cf service-key task-example-mysql EXTERNAL-ACCESS-KEY
```

This should give you back the credentials neccessary to access the database, e.g.:

```json
Getting key EXTERNAL-ACCESS-KEY for service instance task-example-mysql as ghillert@gopivotal.com...

{
 "hostname": "...",
 "jdbcUrl": "jdbc:mysql://...",
 "name": "...",
 "password": "...",
 "port": "3306",
 "uri": "mysql://...",
 "username": "..."
}
```

This should result in a response detailing the access information for the respective database. The result will be different depending on whether the used database service is running internally or whether the service is provided by a third-party. In case of PWS, using ClearDB, we can directly connect to the database as it is a third-party provider.

If you are dealing with an internal service, you may have to create an SSH tunnel via the `cf ssh` command, e.g.:

```bash
cf ssh -L 3306:<host_name>:<port> task-example-mysql
```

Using the free [MySQLWorkbench](https://www.mysql.com/products/workbench/) you should see the following populated data:

![billrun database results](images/CF-task-standalone-task2-database-result.png)

##### Using a Database GUI deployed to Cloud Foundry

Another interesting option to keep an eye on your MySQL instance is to use [PivotalMySQLWeb](https://github.com/pivotal-cf/PivotalMySQLWeb). In a nutshell, you can push PivotalMySQLWeb to your Cloud Foundry space and bind it to your MySql instance allowing you to introspect your MySQL service without having to use local tooling.

Check out the project:

```bash
git clone https://github.com/pivotal-cf/PivotalMySQLWeb.git
cd PivotalMySQLWeb
```

**IMPORTANT**: Please update the credentials first in `src/main/resources/application-cloud.yml` ([Source on GitHub](https://github.com/pivotal-cf/PivotalMySQLWeb/blob/master/src/main/resources/application-cloud.yml)). By default the username is `admin` and the password is `cfmysqlweb`.

Then build the project:

```bash
./mvnw -DskipTests=true package
```

Next, update the `manifest.yml` file:

```yml
applications:
  - name: pivotal-mysqlweb
    memory: 1024M
    instances: 1
    random-route: true
    path: ./target/PivotalMySQLWeb-1.0.0-SNAPSHOT.jar
    services:
      - task-example-mysql
    env:
      JAVA_OPTS: -Djava.security.egd=file:///dev/urandom
```

**IMPORTANT** specify your MySQL service `task-example-mysql`

In this instance we set the property `random-route` to `true` in order to generate a random URL for the application. Watch the console for a printout of the URL. Push the app to Cloud Foundry:

```bash
cf push
```

Now you can login into the application an take a look at the table populated by the `billrun` task application.

![billrun database results](images/CF-task-standalone-task2-database-result-PivotalMySQLWeb.png)

#### Teardown of all Task Applications and Services

With the conclusion of this example you may also want to remove all instances on Cloud Foundry. The following commands will accomplish that:

```bash
cf delete billsetuptask -f
cf delete billrun -f
cf delete pivotal-mysqlweb -f -r
cf delete-service-key task-example-mysql EXTERNAL-ACCESS-KEY -f
cf delete-service task-example-mysql -f
```

The important thing to note here is that we need to delete the service key `EXTERNAL-ACCESS-KEY` before we can delete the `task-example-mysql` service itself. Additionally employed command flags are:

- `-f` Force deletion without confirmation
- `-r` Also delete any mapped routes

### Kubernetes

This section will walk you the billrun application on Kubernetes.

#### Setting up the Kubernetes cluster

For this we need a running [Kubernetes cluster](%currentPath%/installation/kubernetes/). For this example we will deploy to `minikube`.

##### Verify minikube is up and running:

```bash
minikube status
host: Running
kubelet: Running
apiserver: Running
kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.100
```

##### Install the database

We will install a MySQL server, using the default configuration from Spring Cloud Data Flow. Execute the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-deployment.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-pvc.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-secrets.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-svc.yaml
```

##### Build a Docker image for the sample task application

We will build the docker image for the [billrun](#batch_processing_with_spring_batch) app.

For this we will use the [jib maven plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin#build-your-image). If you downloaded the [source distribution](#batch_processing_with_spring_batch), the jib plugin is already configured. If you built the apps from scratch, add the following under `plugins` in pom.xml:

```xml
<plugin>
    <groupId>com.google.cloud.tools</groupId>
    <artifactId>jib-maven-plugin</artifactId>
    <version>0.10.1</version>
    <configuration>
        <from>
            <image>springcloud/openjdk</image>
        </from>
        <to>
            <image>${docker.org}/${project.artifactId}:${docker.version}</image>
        </to>
        <container>
            <useCurrentTimestamp>true</useCurrentTimestamp>
        </container>
    </configuration>
</plugin>
```

Then add the referenced properties, under `properties` For this example, we will use:

```xml
<docker.org>springcloudtask</docker.org>
<docker.version>${project.version}</docker.version>
```

```bash
eval $(minikube docker-env)
./mvnw clean package jib:dockerBuild
```

This will add the image to the `minikube` Docker registry.
Verify its presence by finding `springcloudtask/billrun` in the list of images:

```bash
docker images
```

##### Deploy the app

The simplest way to deploy a batch application is as a standalone [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/).
Deploying batch apps as a [Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) or [CronJob](https://kubernetes.io/docs/tasks/job/) is considered best practice for production environments, but is beyond the scope of this guide.

Save the following to `batch-app.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: billrun
spec:
  restartPolicy: Never
  containers:
    - name: task
      image: springcloudtask/billrun:0.0.1-SNAPSHOT
      env:
        - name: SPRING_DATASOURCE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql
              key: mysql-root-password
        - name: SPRING_DATASOURCE_URL
          value: jdbc:mysql://mysql:3306/task
        - name: SPRING_DATASOURCE_USERNAME
          value: root
        - name: SPRING_DATASOURCE_DRIVER_CLASS_NAME
          value: com.mysql.jdbc.Driver
  initContainers:
    - name: init-mysql-database
      image: mysql:5.6
      env:
        - name: MYSQL_PWD
          valueFrom:
            secretKeyRef:
              name: mysql
              key: mysql-root-password
      command:
        [
          'sh',
          '-c',
          'mysql -h mysql -u root -e "CREATE DATABASE IF NOT EXISTS task;"',
        ]
```

Start the app:

```bash
kubectl apply -f batch-app.yaml
```

When the task is complete, you should see something like this:

```bash
kubectl get pods
NAME                     READY   STATUS      RESTARTS   AGE
mysql-5cbb6c49f7-ntg2l   1/1     Running     0          4h
```

Delete the Pod.

```bash
kubectl delete -f batch-app.yaml
```

Log in to the `mysql` container to query the `BILL_STATEMENTS` table.
Get the name of the `mysql`pod using`kubectl get pods`, as shown above.
Then login:

<!-- Rolling my own to disable erroneous formating -->
<div class="gatsby-highlight" data-language="bash">
<pre class="language-bash"><code>kubectl exec -it mysql-5cbb6c49f7-ntg2l -- /bin/bash
# mysql -u root -p$MYSQL_ROOT_PASSWORD
mysql&gt; select * from task.BILL_STATEMENTS;
</code></pre></div>

The output should look something like:

| id  | first_name | last_name | minutes | data_usage | bill_amount |
| --- | ---------- | --------- | ------- | ---------- | ----------- |
| 1   | jane       | doe       | 500     | 1000       | 6.00        |
| 2   | john       | doe       | 550     | 1500       | 7.00        |
| 3   | melissa    | smith     | 600     | 1550       | 7.55        |
| 4   | michael    | smith     | 650     | 1500       | 8.00        |
| 5   | mary       | jones     | 700     | 1500       | 8.50        |

To uninstall `mysql`:

```bash
kubectl delete all -l app=mysql
```
