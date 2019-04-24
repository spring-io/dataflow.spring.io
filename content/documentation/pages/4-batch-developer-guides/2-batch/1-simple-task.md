---
path: 'batch-developer-guides/batch/simple-task/'
title: 'Spring Cloud Task'
description: 'Create a simple Spring Boot Application using Spring Cloud Task'
---

# Batch Processing with Spring Cloud Task

In this guide we will develop a Spring Boot application that uses Spring Cloud Task and deploy it to Cloud Foundry, Kubernetes, and on your local machine. In another guide, we will deploy the Task using Data Flow.

We will start from the [Spring Initializr](https://start.spring.io/) and create a Spring Cloud Task application.

NOTE: All code for this project can be found [here](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-website/batch-developer-guides/batch/batchsamples).

## Development

Suppose a cell phone data provider needs to create billing statements for customers. The usage data is stored in JSON files that are stored on the file system. The billing solution must pull data from these files, generate the billing data from this usage data, and store it in a `BILLING_STATEMENTS` table.

For this example we will break up the solution into 2 phases:

1. _billsetuptask_: The _billsetuptask_ application will be a Spring Boot application using Spring Cloud Task that will simply create the `BILL_STATEMENTS` table.
1. [billrun](/documentation/batch-developer-guides/batch/spring-batch): The [billrun](/documentation/batch-developer-guides/batch/spring-batch) application will be a Spring Boot application using Spring Cloud Task and Spring Batch that will read usage data from a json file and price the each row and put the resulting data into the `BILL_STATEMENTS` table.

For this section we will create a Spring Cloud Task/Boot application that will create the `BILL_STATEMENTS` table that will be used by the BillRun application.
![BILL_STATMENTS](images/bill_statements.png)

### Initialzr

1. Visit the [Spring Initialzr site](https://start.spring.io/).
1. Select the latest release of spring boot.
1. Create a new Maven project with a Group name of `io.spring` and an Artifact name of `billsetuptask`.
1. In the Dependencies text box, type `task` to select the Cloud Task dependency.
1. In the Dependencies text box, type `jdbc` then select the JDBC dependency.
1. In the Dependencies text box, type `h2` then select the H2 dependency.
   1. We use H2 for unit testing.
1. In the Dependencies text box, type `mysql` then select mysql dependency(or your favorite database).
   1. We use MySql for the runtime database.
1. Click the Generate Project button.
1. Unzip the billsetuptask.zip file and import the project into your favorite IDE.

#### Initialzr Shortcut

Another option instead of using the UI to initialize your project you can do the following:

1. Click the [here](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&baseDir=billsetuptask&groupId=io.spring&artifactId=billsetuptask&name=Bill+Setup+Task&description=Bill+Setup+Task+Sample+App&packageName=io.spring.billsetuptask&packaging=jar&inputSearch=&style=cloud-task&style=jdbc&style=h2&style=mysql) to download the preconfigured billsetuptask.zip.

2. Unzip the billsetuptask.zip file and import the project into your favorite IDE

### Setting up MySql

If you don't have an instance of MySql installed available to you, you can follow these instructions to run a MySql docker image for this example.

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

Now let’s create the elements required for this application.

1.  Using your IDE create the package `io.spring.billsetuptask.configuration`.
1.  Create a [TaskConfiguration](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-website/batch-developer-guides/batch/batchsamples/billsetuptask/src/main/java/io/spring/billsetuptask/configuration/TaskConfiguration.java) class in the `io.spring.billsetuptask.configuration` package using your favorite IDE that looks like the contents below.

```java
{/* highlight-range{2} */}
@Configuration
@EnableTask
public class TaskConfiguration {

    @Autowired
    private DataSource dataSource;

    @Bean
    public CommandLineRunner commandLineRunner() {
        return args -> {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS " +
                    "BILL_STATEMENTS ( id int, " +
                    "first_name varchar(50), last_name varchar(50), " +
                    "minutes int,data_usage int, bill_amount double)");
        };
    }
}
```

The `@EnableTask` annotation sets up a `TaskRepository` which stores information about the task execution such as the start and end time of the task and the exit code.

### Testing

Now let’s create our test. Update the contents of the [BillsetuptaskApplicationTests.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-website/batch-developer-guides/batch/batchsamples/billsetuptask/src/test/java/io/spring/billsetuptask/BillsetuptaskApplicationTests.java) with the following code:

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class BillsetuptaskApplicationTests {

	@Autowired
	private DataSource dataSource;

	@Test
	public void testRepository() {
		JdbcTemplate jdbcTemplate = new JdbcTemplate(this.dataSource);
		int result = jdbcTemplate.queryForObject(
		"SELECT COUNT(*) FROM BILL_STATEMENTS", Integer.class);

		assertEquals(0, result);
	}
}
```

## Deployment

Deploy to local, Cloud Foundry and Kubernetes

### Local

1. Now let’s take the next step of building the project.
   From a command line change directory to the location of your project and build the project using maven
   `./mvnw clean package`

1. Now let’s execute the application with the configurations required to create the "BILL_STATEMENTS" table in the MySql database.
   To configure the execution of the billsetuptask application utilize the following arguments:

   1. _spring.datasource.url_ - set the URL to your database instance. In the sample below we are connecting to a mysql `task` database on our local machine at port 3306.
   1. _spring.datasource.username_ - the user name to be used for the MySql database. In the sample below it is `root`
   1. _spring.datasource.password_ - the password to be used for the MySql database. In the sample below it is `password`
   1. _spring.datasource.driverClassName_ - The driver to use to connect to the MySql database. In the sample below it is `com.mysql.jdbc.Driver'

   ```bash
   $ java -jar target/billsetuptask--0.0.1-SNAPSHOT.jar \
   --spring.datasource.url=jdbc:mysql://localhost:3306/task?useSSL=false \
   --spring.datasource.username=root \
   --spring.datasource.password=password \
   --spring.datasource.driverClassName=com.mysql.jdbc.Driver
   ```

#### Setting the application name for Task Execution

Spring Cloud Task records all task executions to a table called TASK_EXECUTION.
Here is some of the information that is recorded by Spring Cloud Task:

- START_TIME - The time the task execution started
- END_TIME - The time the task execution completed
- TASK_NAME - The name associated with the task execution
- EXIT_CODE - The exit code that was returned by the task execution
- EXIT_MESSAGE - The exit message that was returned for the execution
- ERROR_MESSAGE - The error message that was returned for the execution
- EXTERNAL_EXECUTION_ID - An id to be associated with the task execution

By default the `TASK_NAME` is "application".

Using the instructions below query the TASK_EXECUTION table:

<!-- Rolling my own to disable erroneous formating -->
<div class="gatsby-highlight" data-language="bash">
<pre class="language-bash"><code>$ docker exec -it mysql bash -l
# mysql -u root -ppassword
mysql&gt; select * from task.TASK_EXECUTION;
</code></pre></div>

The results will look something like this:

```
| TASK_EXECUTION_ID | START_TIME          | END_TIME            | TASK_NAME       | EXIT_CODE | EXIT_MESSAGE | ERROR_MESSAGE | LAST_UPDATED        | EXTERNAL_EXECUTION_ID | PARENT_EXECUTION_ID |
|-------------------|---------------------|---------------------|-----------------|-----------|--------------|---------------|---------------------|-----------------------|---------------------|
|                 1 | 2019-04-23 18:10:57 | 2019-04-23 18:10:57 | Bill Setup Task |         0 | NULL         | NULL          | 2019-04-23 18:10:57 | NULL                  |                NULL |
```

Spring Cloud Task allows us to change this setting using the `spring.cloud.task.name`. To do this we will add that property to our next execution as follows:

```bash
$ java -jar target/billsetuptask-0.0.1-SNAPSHOT.jar \
--spring.datasource.url=jdbc:mysql://localhost:3306/task?useSSL=false \
--spring.datasource.username=root \
--spring.datasource.password=password \
--spring.datasource.driverClassName=com.mysql.jdbc.Driver \
--spring.cloud.task.name=BillSetupTest1
```

Now when you query the table you will see that the last task execution in the query now has the name "BillSetupTest1".

#### Cleanup

To stop and remove the mysql container running in the docker instance:

```bash
$ docker stop mysql
$ docker rm mysql
```

### Cloud Foundry

As Alana I must ask for an org/space

### Kubernetes

Where all the cool kids play.

## What's Next

Congratulations you have just created and deployed a Spring Cloud Task application. Now lets go onto the [next section](/documentation/batch-developer-guides/batch/spring-batch) and create a Spring Batch Application.
