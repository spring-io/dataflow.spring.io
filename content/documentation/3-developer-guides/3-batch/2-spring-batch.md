---
path: 'developer-guides/batch/spring-batch/'
title: 'Spring Batch Jobs'
description: 'Create a Spring Batch Job'
---

# Batch Processing with Spring Batch

In this guide we will develop a Spring Batch application and deploy it to Cloud Foundry, Kubernetes, and on your local machine. In another guide, we will deploy the Spring Batch application using Data Flow.

We will start from initializr and create a Spring Batch application.
Note for CF we need a manifest, for k8s we need a service/deployment yaml.

NOTE: All code for this project can be found here: https://github.com/cppwfs/edutasksamples

## Development

Imagine you are working for a cell phone data provider and you are responsible for writing the solution that will create the billing statements for the customers. The usage data that you will be using will be stored in JSON files stored in a file on your file system. Your solution will be responsible for pulling the data from these files, storing the raw data into a table in your database and then generate a price from this usage data and storing it into a billing_statement table.  
We could implement this entire solution into a single Spring Boot Application that utilizes Spring Batch, however for this example we will break up the solution into 2 phases:

1. BillUsage will be a Spring Boot application using Spring Cloud Task that will read data from JSON files from the classpath and put the data into the `BILL_USAGE` table.
1. BillRun will be a Spring Boot application using Spring Cloud Task and Spring Batch that will read data from `BILL_USAGE` table and price the each row and put the resulting data into the `BILL_STATEMENTS` table.

For this section we will create a Spring Cloud Task/Spring Batch BillRun application that will read the BILL_USAGE table containing customer usage data from the database and price each entry and place the result into the BILL_STATEMENTS table.  
This usage data will then be inserted into a `BILL_STATEMENTS` table that looks like the following:

```
CREATE TABLE BILL_STATEMENTS
(
   id int,
   first_name varchar(50),
   last_name varchar(50),
   minutes int,
   data_usage int,
   bill_amount double
)
```

This will be done using a single step batch job, `JdbcCursorItemReader`, `BillProcessor`, `JdbcBatchItemWriter`, no other dependencies outside of Spring Batch and Spring Cloud Task

### Initialzr

1. Visit the Spring Initialzr site.
1. Select the latest release of spring boot
1. Create a new Maven or Gradle project with a Group name of io.spring and an Artifact name of billrun.
1. In the Dependencies text box, type task to select the Cloud Task dependency.
1. In the Dependencies text box, type jdbc then select the JDBC dependency.
1. In the Dependencies text box, type h2 then select the H2.
1. In the Dependencies text box, type mysql then select mysql (or your favorite database)
1. In the Dependencies text box, type Batch then select Batch.
1. Click the Generate Project button
1. Unzip the billrun.zip file and import the project into your favorite IDE.

### Biz Logic

1. Using your IDE create a usagedata.json file in the resources directory.

   1. Copy and paste the contents below into the usagedata.json file:

      ```
      [{"id":"1","firstName":"jane","lastName":"doe","minutes":"500","dataUsage":"1000"},
        {"id":"2","firstName":"john","lastName":"doe","minutes":"550","dataUsage":"1500"},
        {"id":"3","firstName":"melissa","lastName":"smith","minutes":"600","dataUsage":"1550"},
        {"id":"4","firstName":"michael","lastName":"smith","minutes":"650","dataUsage":"1500"},
        {"id":"5","firstName":"mary","lastName":"jones","minutes":"650","dataUsage":"1500"}]
      ```

1. In your favorite IDE create a `configuration` package under the `io.spring.billrun` package
1. Create a `Usage` class in the `io.spring.billrun.configuration` using your favorite IDE.

   1. Now copy and paste the code below into the Usage class

      ```
      public class Usage {

       private Long id;

       private String firstName;

       private String lastName;

       private Long minutes;

       private Long dataUsage;

       public Usage() {
       }

       public Usage(Long id, String firstName, String lastName, Long minutes, Long dataUsage) {
          this.firstName = firstName;
          this.lastName = lastName;
          this.minutes = minutes;
          this.dataUsage = dataUsage;
          this.id = id;
       }

       public Long getId() {
          return id;
       }

       public void setId(Long id) {
          this.id = id;
       }

       public String getFirstName() {
          return firstName;
       }

       public void setFirstName(String firstName) {
          this.firstName = firstName;
       }

       public String getLastName() {
          return lastName;
       }

       public void setLastName(String lastName) {
          this.lastName = lastName;
       }

       public Long getDataUsage() {
          return dataUsage;
       }

       public void setDataUsage(Long dataUsage) {
          this.dataUsage = dataUsage;
       }

       public Long getMinutes() {
          return minutes;
       }

       public void setMinutes(Long minutes) {
          this.minutes = minutes;
       }
      }
      ```

1. Create a `Bill` class in the `io.spring.billrun.configuration` using your favorite IDE.

   1. Now copy and paste the code below into the Bill class

      ```
      public class Bill {

        private Long id;

        private String firstName;

        private String lastName;

        private Long dataUsage;

        private Long minutes;

        private Double billAmount;

        public Bill(Long id, String firstName, String lastName, Long dataUsage, Long minutes, Double billAmount) {
           this.firstName = firstName;
           this.lastName = lastName;
           this.dataUsage = dataUsage;
           this.minutes = minutes;
           this.billAmount = billAmount;
           this.id = id;
        }

        public Bill() {
        }

        public String getFirstName() {
           return firstName;
        }

        public void setFirstName(String firstName) {
           this.firstName = firstName;
        }

        public String getLastName() {
           return lastName;
        }

        public void setLastName(String lastName) {
           this.lastName = lastName;
        }

        public Long getDataUsage() {
           return dataUsage;
        }

        public void setDataUsage(Long dataUsage) {
           this.dataUsage = dataUsage;
        }

        public Long getMinutes() {
           return minutes;
        }

        public void setMinutes(Long minutes) {
           this.minutes = minutes;
        }

        public Double getBillAmount() {
           return billAmount;
        }

        public void setBillAmount(Double billAmount) {
           this.billAmount = billAmount;
        }

        public Long getId() {
           return id;
        }

        public void setId(Long id) {
           this.id = id;
        }
      }
      ```

1. Create a BillProcessor class in the `io.spring.billrun.configuration` using your favorite IDE.

   1. Now copy and paste the code below into the BillProcessor class

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

1. Create a BillingConfiguration class in the `io.spring.billrun.configuration` using your favorite IDE.

   1. Replace the contents of the BillingConfiguration.java with the following code:

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

          @Value("${usage.file.name:file:/Users/glennrenfro/tmp/usageinfo.txt}")
          private Resource usageResource;

          @Bean
          public Job job1(ItemReader<Usage> reader, ItemProcessor<Usage,Bill> itemProcessor, ItemWriter<Bill> writer) {
              Step step = stepBuilderFactory.get("BillProcessing")
                      .<Usage, Bill>chunk(1)
                      .reader(reader)
                      .processor(itemProcessor)
                      .writer(writer)
                      .build();

              return jobBuilderFactory.get("BillJob")
                      .start(step)
                      .build();
          }

          @Bean
          public JdbcCursorItemReader<Usage> jdbcItemReader(DataSource dataSource) {
              return  new JdbcCursorItemReaderBuilder<Usage>()
                      .dataSource(dataSource)
                      .name("usageReader")
                      .sql("SELECT * from BILL_USAGE")
                      .saveState(false)
                      .rowMapper((rs, rowNum) -> {
                          return new Usage(rs.getLong("ID"), rs.getString("FIRST_NAME"),
                                  rs.getString("LAST_NAME"), rs.getLong("MINUTES"), rs.getLong("DATA_USAGE"));
                      })
                      .build();
          }

          @Bean
          public ItemWriter<Bill> jdbcBillWriter(DataSource dataSource) {
              JdbcBatchItemWriter<Bill> writer = new JdbcBatchItemWriterBuilder<Bill>()
                              .beanMapped()
                      .dataSource(dataSource)
                      .sql("INSERT INTO BILL_STATEMENTS (id, first_name, last_name, minutes, data_usage,bill_amount) VALUES (:id, :firstName, :lastName, :minutes, :dataUsage, :billAmount)")
                      .build();
              return writer;
          }

          @Bean
          ItemProcessor<Usage, Bill> billProcessor() {
              return new BillProcessor();
          }

         	@Configuration
         	protected static class DataSourceInitializerInvokerConfiguration implements LoadTimeWeaverAware {

         		@Autowired
         		private ListableBeanFactory beanFactory;

         		@PostConstruct
         		public void init() {
         			String cls = "org.springframework.boot.autoconfigure.jdbc.DataSourceInitializerInvoker";
         			if (beanFactory.containsBean(cls)) {
         				beanFactory.getBean(cls);
         			}
         		}

         		@Override
         		public void setLoadTimeWeaver(LoadTimeWeaver ltw) {
         		}
         	}
       }
      ```

   The `@EnableBatchProcessing` annotation enables Spring Batch features and provide a base configuration for setting up batch jobs.
   The `@EnableTask` annotation sets up TaskRepository which stores information about the task execution such as the start and end time of the task and the exit code.

### Testing

Now let’s create our test. Replace the contents of the BillrunApplicationTests.java with the following code:

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
						"first_name, last_name, minutes, data_usage, bill_amount FROM bill_statements",
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
        cd 	<your project directory>
        mvn clean package
        ```

2.  Now let’s execute the application with the configurations required to process the usage information in the database.

    To configure the execution of the billrun application utilize the following arguments:

    1. _spring.datasource.url_ - set the URL to your database instance. In the sample below we are connecting to a mysql `practice` database on our local machine at port 3306.
    1. _spring.datasource.username_ - the user name to be used for the MySql database. In the sample below it is `root`
    1. _spring.datasource.password_ - the password to be used for the MySql database. In the sample below it is `password`
    1. _spring.datasource.driverClassName_ - The driver to use to connect to the MySql database. In the sample below it is `com.mysql.jdbc.Driver'
    1. _spring.datasource.initialization-mode_ - initializes the database with the BILL_STATEMENTS and BILL_USAGE tables required for this app. In the sample below we state that we `always` want to do this. This will not overwrite the tables if they already exist.
    1. _spring.batch.initialize-schema_ - initializes the database with the tables required for Spring Batch. In the sample below we state that we `always` want to do this. This will not overwrite the tables if they already exist.
    1. _io.spring.populate-usage-table_ - populates the BILL_USAGE table with seed data. It defaults to true, which means the data will be populated. However if you have already run `billusage`set this value to false, because the table has already been populated.

    ```
    java -jar target/billrun-0.0.1-SNAPSHOT.jar --spring.datasource.url=jdbc:mysql://localhost:3306/practice?useSSL=false --spring.datasource.username=root --spring.datasource.password=password --spring.datasource.driverClassName=com.mysql.jdbc.Driver --spring.datasource.initialization-mode=always --spring_batch_initialize-schema=always
    ```

### Cloud Foundry

As Alana I must ask for an org/space

### Kubernetes

Where all the cool kids play.
