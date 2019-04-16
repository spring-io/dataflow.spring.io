---
path: 'developer-guides/batch/simple-task/'
title: 'Spring Cloud Task'
description: 'Create a simple batch job using Spring Cloud Task'
---

# Batch Processing with Spring Cloud Task

In this guide we will develop a batch application using Spring Cloud Task and deploy it to Cloud Foundry, Kubernetes, and on your local machine. In another guide, we will deploy the Task using Data Flow.

We will start from initializr and create two Spring Cloud Batch applications.
Note for CF we need a manifest, for k8s we need a service/deployment yaml.

NOTE: All code for this project can be found here: https://github.com/cppwfs/edutasksamples

## Development

Imagine you are working for a cell phone data provider and you are responsible for writing the solution that will create the billing statements for the customers. The usage data that you will be using will be stored in JSON files stored in a file on your file system. Your solution will be responsible for pulling the data from these files, storing the raw data into a table in your database and then generate a price from this usage data and storing it into a billing_statement table.  
We could implement this entire solution into a single Spring Boot Application that utilizes Spring Batch, however for this example we will break up the solution into 2 phases:

1. BillUsage will be a Spring Boot application using Spring Cloud Task that will read data from JSON files from the classpath and put the data into the `BILL_USAGE` table.
1. BillRun will be a Spring Boot application using Spring Cloud Task and Spring Batch that will read data from `BILL_USAGE` table and price the each row and put the resulting data into the `BILL_STATEMENTS` table.

'For this section we will create a Spring Cloud Task/Boot application that will read JSON files containing customer usage data from a S3 bucket and write the raw data to a table in the database.  
The data contained in the files will be: id, customer first name , customer last name, cellular minutes, and data usage. The format of the data looks like this

```
[{"id":"16","firstName":"jane","lastName":"doe","minutes":"500","dataUsage":"1000"},
{"id":"20","firstName":"mary","lastName":"jones","minutes":"650","dataUsage":"1500"}]
```

This usage data will then be inserted into a `BILL_USAGE` table that looks like the following:

```
CREATE TABLE BILL_USAGE
(
   id int,
   first_name varchar(50),
   last_name varchar(50),
   minutes int,
   data_usage int
)
```

### Initialzr

1. Visit the Spring Initialzr site.
1. Select the latest release of spring boot
1. Create a new Maven or Gradle project with a Group name of io.spring and an Artifact name of billusage.
1. In the Dependencies text box, type task to select the Cloud Task dependency.
1. In the Dependencies text box, type jdbc then select the JDBC dependency.
1. In the Dependencies text box, type h2 then select the H2.
1. In the Dependencies text box, type mysql then select mysql (or your favorite database)
1. Click the Generate Project button
1. Unzip the billusage.zip file and import the project into your favorite IDE.
1. From your favorite IDE add the following dependeny to your pom.xml
   ```
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>
   ```

### Biz Logic

Now let’s create the elements required for this application.

1.  Using your IDE create a usagedata.json file in the resources directory.
    1. Copy and paste the contents below into the usagedata.json file:
       ```
       [{"id":"1","firstName":"jane","lastName":"doe","minutes":"500","dataUsage":"1000"},
         {"id":"2","firstName":"john","lastName":"doe","minutes":"550","dataUsage":"1500"},
         {"id":"3","firstName":"melissa","lastName":"smith","minutes":"600","dataUsage":"1550"},
         {"id":"4","firstName":"michael","lastName":"smith","minutes":"650","dataUsage":"1500"},
         {"id":"5","firstName":"mary","lastName":"jones","minutes":"650","dataUsage":"1500"}]
       ```
1.  In your favorite IDE create a `configuration` package under the `io.spring.billusage` package
1.  Create a Usage class in the `io.spring.billusage.configuration` using your favorite IDE.

    1. Now create a Usage class that looks like the contents below:

       ```
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

1.  Create a BillUsageProcessor class in the `io.spring.billusage.configuration` using your favorite IDE.

    1. Now create a BillUsageProcessor class that looks like the contents below:

       ```
       public class BillUsageProcessor {
       ```


           @Value("${io.spring.inputBucket:classpath:usagedata.json}")
           private String inputBucket;

           private final NamedParameterJdbcTemplate jdbcTemplate;

           private PathMatchingResourcePatternResolver resourcePatternResolver;

           private static final String CREATE_USAGE = "INSERT into "
                   + "BILL_USAGE(id, first_name, last_name, minutes, data_usage ) values (:id, :firstName, :lastName, :minutes, :dataUsage)";


           public BillUsageProcessor(PathMatchingResourcePatternResolver resourcePatternResolver, DataSource dataSource) {
               this.resourcePatternResolver = resourcePatternResolver;
               this.jdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
           }

           public void processResources() throws IOException {
               Resource[] resources = this.resourcePatternResolver.getResources(this.inputBucket);
               for (Resource resource : resources) {
                   processResource(resource);
               }
           }

           public void processResource(Resource resource) throws IOException {
               ObjectMapper mapper = new ObjectMapper();
               CollectionType javaType = mapper.getTypeFactory().constructCollectionType(List.class, Usage.class);
               List<Usage> usageList = mapper.readValue(StreamUtils.copyToString( resource.getInputStream(), StandardCharsets.UTF_8), javaType);
               for(Usage usage : usageList) {
                   insertArgument(usage);
               }
           }
           private void insertArgument(Usage usage) {
               final MapSqlParameterSource queryParameters = new MapSqlParameterSource()
                       .addValue("id", usage.getId(), Types.BIGINT)
                       .addValue("firstName", usage.getFirstName(), Types.VARCHAR)
                       .addValue("lastName", usage.getLastName(), Types.VARCHAR)
                       .addValue("minutes", usage.getMinutes(), Types.BIGINT)
                       .addValue("dataUsage", usage.getDataUsage(), Types.BIGINT);
               this.jdbcTemplate.update(CREATE_USAGE, queryParameters);
           }
       }
       ```

1.  Create a TaskConfiguration class in the `io.spring.billusage.configuration` using your favorite IDE.

    1.  Now create a BillUsageProcessor class that looks like the contents below:

            ```
            @Configuration
            @EnableTask
            public class TaskConfiguration {

                @Bean
                PathMatchingResourcePatternResolver resourcePatternResolver(ResourcePatternResolver resourcePatternResolver) {
                    return new PathMatchingResourcePatternResolver(resourcePatternResolver);
                }

                @Bean
                CommandLineRunner commandLineRunner(BillUsageProcessor billUsageProcessor) {
                    return args -> {
                        billUsageProcessor.processResources();
                    };
                }

                @Bean
                public BillUsageProcessor s3Processor(
                        PathMatchingResourcePatternResolver resourcePatternResolver,
                        DataSource dataSource) {
                    return new BillUsageProcessor(resourcePatternResolver,dataSource);
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

        The `@EnableTask` annotation sets up TaskRepository which stores information about the task execution such as the start and end time of the task and the exit code.
        ```

### Testing

Now let’s create our test. Replace the contents of the BillusageApplicationTests.java with the following code:

```
@RunWith(SpringRunner.class)
@SpringBootTest
public class BillusageApplicationTests {

    @Autowired
    private DataSource dataSource;

    @Test
    public void testRepository() {
            List<Usage> usages = getResultsFromDB(dataSource);
            assertThat(usages.size()).isEqualTo(5);
            assertThat(usages.get(0).getId()).isEqualTo(1);
            assertThat(usages.get(0).getFirstName()).isEqualTo("jane");
    }

    public List<Usage> getResultsFromDB(DataSource dataSource) {
            NamedParameterJdbcTemplate jdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
            return jdbcTemplate.query("select ID, FIRST_NAME, LAST_NAME, MINUTES, DATA_USAGE FROM BILL_USAGE", new UsageRowMapper());
    }

    private final class UsageRowMapper implements RowMapper<Usage> {
        @Override
        public Usage mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Usage(rs.getLong("id"),
                    rs.getString("FIRST_NAME"), rs.getString("LAST_NAME"),
                    rs.getLong("MINUTES"), rs.getLong("DATA_USAGE"));
        }

    }
}
```

## Deployment

Deploy to local, Cloud Foundry and Kubernetes

### Local

1. Now let’s take the next step of building the project.
   From a command line change directory to the location of your project and build the project using maven
   `cd <your project directory> mvn clean package`

1. Now let’s execute the application with the configurations required to pull the data from the file and write the results to the MySql database.
   To configure the execution of the billrun application utilize the following arguments:

   1. _spring.datasource.url_ - set the URL to your database instance. In the sample below we are connecting to a mysql `practice` database on our local machine at port 3306.
   1. _spring.datasource.username_ - the user name to be used for the MySql database. In the sample below it is `root`
   1. _spring.datasource.password_ - the password to be used for the MySql database. In the sample below it is `password`
   1. _spring.datasource.driverClassName_ - The driver to use to connect to the MySql database. In the sample below it is `com.mysql.jdbc.Driver'
   1. _spring.datasource.initialization-mode_ - initializes the database with the BILL_USAGE table required for this app. In the sample below we state that we `always` want to do this. This will not overwrite the tables if they already exist.

   ```
   java -jar target/billusage-0.0.1-SNAPSHOT.jar --spring.datasource.url=jdbc:mysql://localhost:3306/practice?useSSL=false  --spring.datasource.username=root --spring.datasource.password=password --spring.datasource.driverClassName=com.mysql.jdbc.Driver --spring.datasource.initialization-mode=always
   ```

### Cloud Foundry

As Alana I must ask for an org/space

### Kubernetes

Where all the cool kids play.
