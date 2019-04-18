---
path: 'batch-developer-guides/batch/spring-batch/'
title: 'Spring Batch Jobs'
description: 'Create a Spring Batch Job'
---

# Batch Processing with Spring Batch

In this guide we will develop a Spring Batch application and deploy it to Cloud Foundry, Kubernetes, and on your local machine. In another guide, we will deploy the Spring Batch application using Data Flow.

We will start from [Spring Initializr](https://start.spring.io/) and create a Spring Batch application.

NOTE: All code for this project can be found here: https://github.com/cppwfs/edutasksamples

## Development

Suppose a cell phone data provider needs to create billing statements for customers. The usage data is stored in JSON files that are stored on the file system. The billing solution must pull data from these files, generate the billing data from this usage data, and store it in a `BILL_STATEMENTS` table.

We could implement this entire solution into a single Spring Boot Application that utilizes Spring Batch, however for this example we will break up the solution into 2 phases:

1. _billsetuptask_ - will be a Spring Boot application using Spring Cloud Task that will simply create the `BILL_STATEMENTS` table. While this is a very simple application, it does show the basic features of Spring Cloud Task.
1. _billrun_ - will be a Spring Boot application using Spring Cloud Task and Spring Batch that will read usage data from a json file and price the each row and put the resulting data into the `BILL_STATEMENTS` table.

For this section we will create a Spring Cloud Task/Spring Batch bill run application that will read usage information from a json file containing customer usage data and price each entry and place the result into the `BILL_STATEMENTS` table.

This will be done using a single step batch job, `JsonItemReader`, `BillProcessor`, `JdbcBatchItemWriter`.

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
1. In the Dependencies text box, type Batch then select Batch.
1. Click the Generate Project button.
1. Unzip the billrun.zip file and import the project into your favorite IDE.

### Biz Logic

1.  Using your IDE create a usageinfo.json file in the resources directory.

    1. Copy the data from [here](https://github.com/cppwfs/edutasksamples/blob/master/billrun/src/main/resources/usageinfo.json) and insert it into the usageinfo.json file you just created.

1.  Using your IDE create a schema.sql file in the resources directory.

    1. Copy the data from [here](https://github.com/cppwfs/edutasksamples/blob/master/billrun/src/main/resources/schema.sql) and insert it into the schema.sql file you just created.

1.  In your favorite IDE create the `io.spring.billrun.configuration` package
1.  Create a `Usage` class in the `io.spring.billrun.configuration` using your favorite IDE that looks like the contents in [Usage.java](https://github.com/cppwfs/edutasksamples/blob/master/billrun/src/main/java/io/spring/billrun/configuration/Usage.java).

1.  Create a `Bill` class in the `io.spring.billrun.configuration` using your favorite IDE that looks like the contents in [Bill.java](https://github.com/cppwfs/edutasksamples/blob/master/billrun/src/main/java/io/spring/billrun/configuration/Bill.java).

1.  Create a [BillProcessor](https://github.com/cppwfs/edutasksamples/blob/master/billrun/src/main/java/io/spring/billrun/configuration/BillProcessor.java) class in the `io.spring.billrun.configuration` using your favorite IDE that looks like the contents below.

    ```
    public class BillProcessor implements ItemProcessor<Usage, Bill> {

      @Override
      public Bill process(Usage usage) {

         Double billAmount = usage.getDataUsage() * .001 + usage.getMinutes() * .01;
         return new Bill(usage.getId(), usage.getFirstName(), usage.getLastName(),
               usage.getDataUsage(), usage.getMinutes(), billAmount);
      }
    }
    ```

1.  Create a [BillingConfiguration](https://github.com/cppwfs/edutasksamples/blob/master/billrun/src/main/java/io/spring/billrun/configuration/BillingConfiguration.java) class in the `io.spring.billrun.configuration` using your favorite IDE that looks like the contents below.

    ```
      @Configuration
      @EnableTask
      @EnableBatchProcessing
      public class BillingConfiguration {
          private static final Log logger = LogFactory.getLog(BillingConfiguration.class);

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

    The `@EnableBatchProcessing` annotation enables Spring Batch features and provide a base configuration for setting up batch jobs.
    The `@EnableTask` annotation sets up a TaskRepository which stores information about the task execution such as the start and end time of the task and the exit code.

### Testing

Now let’s create our test. Update the [BillrunApplicationTests.java](https://github.com/cppwfs/edutasksamples/blob/master/billrun/src/test/java/io/spring/billrun/BillrunApplicationTests.java) such that looks like the contents below.

```
@RunWith(SpringRunner.class)
@SpringBootTest
@SpringBatchTest
public class BillrunApplicationTests {

	@Autowired
	private JobLauncherTestUtils jobLauncherTestUtils;

	@Autowired
	private DataSource dataSource;

	private JdbcTemplate jdbcTemplate;

	@Before
	public void setup()  {
		this.jdbcTemplate = new JdbcTemplate(this.dataSource);
	}

	@Test
	public void testJobResults() throws Exception{
		testResult();
	}


	private void testResult() {
		List<BillStatement> billStatements = this.jdbcTemplate.query("select ID, " +
				"first_name, last_name, minutes, data_usage, bill_amount FROM " +
				"bill_statements",
				(rs, rowNum) -> new BillStatement(rs.getLong("id"),
						rs.getString("FIRST_NAME"), rs.getString("LAST_NAME"),
						rs.getLong("MINUTES"), rs.getLong("DATA_USAGE"),
						rs.getDouble("bill_amount")));
		assertThat(billStatements.size()).isEqualTo(5);

		BillStatement billStatement = billStatements.get(0);
		assertThat(billStatement.getBillAmount()).isEqualTo(6);
		assertThat(billStatement.getFirstName()).isEqualTo("jane");
		assertThat(billStatement.getLastName()).isEqualTo("doe");
		assertThat(billStatement.getId()).isEqualTo(1);
		assertThat(billStatement.getMinutes()).isEqualTo(500);
		assertThat(billStatement.getDataUsage()).isEqualTo(1000);

	}

	public static class BillStatement extends Usage {

		public BillStatement(Long id, String firstName, String lastName, Long minutes, Long dataUsage, double billAmount) {
			super(id, firstName, lastName, minutes, dataUsage);
			this.billAmount = billAmount;
		}

		private double billAmount;

		public double getBillAmount() {
			return billAmount;
		}

		public void setBillAmount(double billAmount) {
			this.billAmount = billAmount;
		}
	}

}

```

## Deployment

Deploy to local, Cloud Foundry and Kubernetes

### Local

1.  Now let’s take the next step of building the project.
    From a command line change directory to the location of your project and build the project using maven

        ```
        $ cd <your project directory>
        $ mvn clean package
        ```

2.  Now let’s execute the application with the configurations required to process the usage information in the database.

    To configure the execution of the billrun application utilize the following arguments:

    1. _spring.datasource.url_ - set the URL to your database instance. In the sample below we are connecting to a mysql `practice` database on our local machine at port 3306.
    1. _spring.datasource.username_ - the user name to be used for the MySql database. In the sample below it is `root`
    1. _spring.datasource.password_ - the password to be used for the MySql database. In the sample below it is `password`
    1. _spring.datasource.driverClassName_ - The driver to use to connect to the MySql database. In the sample below it is `com.mysql.jdbc.Driver'
    1. _spring.datasource.initialization-mode_ - initializes the database with the BILL_STATEMENTS and BILL_USAGE tables required for this app. In the sample below we state that we `always` want to do this. This will not overwrite the tables if they already exist.
    1. _spring.batch.initialize-schema_ - initializes the database with the tables required for Spring Batch. In the sample below we state that we `always` want to do this. This will not overwrite the tables if they already exist.

    ```
    $ java -jar target/billrun-0.0.1-SNAPSHOT.jar \
    --spring.datasource.url=jdbc:mysql://localhost:3306/practice?useSSL=false \
    --spring.datasource.username=root \
    --spring.datasource.password=password \
    --spring.datasource.driverClassName=com.mysql.jdbc.Driver \
    --spring.datasource.initialization-mode=always \
    --spring.batch.initialize-schema=always
    ```

### Cloud Foundry

As Alana I must ask for an org/space

### Kubernetes

Where all the cool kids play.
