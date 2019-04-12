---
path: 'developer-guides/batch/spring-batch/'
title: 'Spring Batch Jobs'
description: 'Create a Spring Batch Job'
---

# Batch Processing with Spring Batch

In this guide we will develop 2 applications,

1. A Spring Boot application that uses Spring Cloud Task
1. A Spring Boot application that uses Spring Cloud Task and Spring Batch.

The guide will show you how to deploy both applications to Cloud Foundry, Kubernetes, and on your local machine. In another guide, we will deploy the applications using Data Flow.

We will start from initializr and create the two applications.
Note for CF we need a manifest, for k8s we need a service/deployment yaml.

## Development

Imagine you are working for a cell phone data provider and you are responsible for writing the solution that will create the billing statements for the customers. The usage data that you will be using will be stored in JSON files stored in a S3 bucket. Your solution will be responsible for pulling the data from these files, storing the raw data into a table in your database and then generate a price from this usage data and storing it into a billing_statement table.  
We could implement this entire solution into a single Spring Boot Application that utilizes Spring Batch, however for this example we will break up the solution into 2 phases:

1. BillUsage will be a Spring Boot application using Spring Cloud Task that will read data from JSON files from a S3 bucket and put the data into the `BILL_USAGE` table.
1. BillRun will be a Spring Boot application using Spring Cloud Task and Spring Batch that will read data from `BILL_USAGE` table and price the each row and put the resulting data into the `BILL_STATEMENTS` table.

### Bill Usage

For this section we will create a Spring Cloud Task/Boot application that will read JSON files containing customer usage data from a S3 bucket and write the raw data to a table in the database.  
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

#### Initialzr

1. Visit the Spring Initialzr site.
1. Select the latest release of spring boot
1. Create a new Maven or Gradle project with a Group name of io.spring and an Artifact name of billusage.
1. In the Dependencies text box, type task to select the Cloud Task dependency.
1. In the Dependencies text box, type jdbc then select the JDBC dependency.
1. In the Dependencies text box, type h2 then select the H2.
1. In the Dependencies text box, type mysql then select mysql (or your favorite database)
1. In the Dependencies text box, type aws core and then select AWS Core
1. Click the Generate Project button
1. Unzip the billusage.zip file and import the project into your favorite IDE.

#### Biz Logic

Now let’s create the configuration files required for this application.

1. In your favorite IDE create a `configuration` package under the `io.spring.billusage` package
1. Create a Usage class in the `io.spring.billusage.configuration` using your favorite IDE.

   1. Now copy and paste the code below into the Usage class

      ```
      /*
      * Copyright 2019 the original author or authors.
      *
      *  Licensed under the Apache License, Version 2.0 (the "License");
      *  you may not use this file except in compliance with the License.
      *  You may obtain a copy of the License at
      *
      *          https://www.apache.org/licenses/LICENSE-2.0
      *
      *  Unless required by applicable law or agreed to in writing, software
      *  distributed under the License is distributed on an "AS IS" BASIS,
      *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      *  See the License for the specific language governing permissions and
      *  limitations under the License.
      */

      package io.spring.billusage.configuration;

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

        @Override
        public String toString() {
           return "Usage{" +
                 "id=" + id +
                 ", firstName='" + firstName + '\'' +
                 ", lastName='" + lastName + '\'' +
                 ", minutes=" + minutes +
                 ", dataUsage=" + dataUsage +
                 '}';
        }
      }
      ```

1. Create a S3Processor class in the `io.spring.billusage.configuration` using your favorite IDE.

   1. Now copy and paste the code below into the S3Processor class

      ```
      /*
      * Copyright 2019 the original author or authors.
      *
      *  Licensed under the Apache License, Version 2.0 (the "License");
      *  you may not use this file except in compliance with the License.
      *  You may obtain a copy of the License at
      *
      *          https://www.apache.org/licenses/LICENSE-2.0
      *
      *  Unless required by applicable law or agreed to in writing, software
      *  distributed under the License is distributed on an "AS IS" BASIS,
      *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      *  See the License for the specific language governing permissions and
      *  limitations under the License.
      */

      package io.spring.billusage.configuration;

      import java.io.IOException;
      import java.nio.charset.StandardCharsets;
      import java.sql.Types;
      import java.util.List;

      import com.fasterxml.jackson.databind.ObjectMapper;
      import com.fasterxml.jackson.databind.type.CollectionType;
      import javax.sql.DataSource;

      import org.springframework.beans.factory.annotation.Value;
      import org.springframework.cloud.aws.core.io.s3.PathMatchingSimpleStorageResourcePatternResolver;
      import org.springframework.core.io.Resource;
      import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
      import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
      import org.springframework.util.StreamUtils;

      public class S3Processor {

        @Value("${io.spring.inputBucket:s3://cellsample/sampledata/*.*}")
        private String inputBucket;

        private final NamedParameterJdbcTemplate jdbcTemplate;

        private PathMatchingSimpleStorageResourcePatternResolver resourcePatternResolver;

        private static final String CREATE_USAGE = "INSERT into "
              + "BILL_USAGE(id, first_name, last_name, minutes, data_usage ) values (:id, :firstName, :lastName, :minutes, :dataUsage)";


        public S3Processor(PathMatchingSimpleStorageResourcePatternResolver resourcePatternResolver, DataSource dataSource) {
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

1. Create a TaskConfiguration class in the `io.spring.billusage.configuration` using your favorite IDE.

   1. Now copy and paste the code below into the TaskConfiguration class

      ```
      /*
      * Copyright 2019 the original author or authors.
      *
      *  Licensed under the Apache License, Version 2.0 (the "License");
      *  you may not use this file except in compliance with the License.
      *  You may obtain a copy of the License at
      *
      *          https://www.apache.org/licenses/LICENSE-2.0
      *
      *  Unless required by applicable law or agreed to in writing, software
      *  distributed under the License is distributed on an "AS IS" BASIS,
      *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      *  See the License for the specific language governing permissions and
      *  limitations under the License.
      */

      package io.spring.billusage.configuration;

      import com.amazonaws.services.s3.AmazonS3;

      import org.springframework.boot.CommandLineRunner;
      import org.springframework.cloud.aws.core.io.s3.PathMatchingSimpleStorageResourcePatternResolver;
      import org.springframework.cloud.task.configuration.EnableTask;
      import org.springframework.context.annotation.Bean;
      import org.springframework.context.annotation.Configuration;
      import org.springframework.core.io.support.ResourcePatternResolver;

      @Configuration
      @EnableTask
      public class TaskConfiguration {

        @Bean
        PathMatchingSimpleStorageResourcePatternResolver resourcePatternResolver(AmazonS3 amazonS3, ResourcePatternResolver resourcePatternResolver) {
           return new PathMatchingSimpleStorageResourcePatternResolver(amazonS3, resourcePatternResolver);
        }

        @Bean
        CommandLineRunner commandLineRunner(S3Processor s3Processor) {
           return args -> {
              s3Processor.processResources();
           };
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

1. Create a TaskProcessorConfiguration class in the `io.spring.billusage.configuration` using your favorite IDE.

   1. Now copy and paste the code below into the TaskProcessorConfiguration class

      ```
      /*
      * Copyright 2019 the original author or authors.
      *
      *  Licensed under the Apache License, Version 2.0 (the "License");
      *  you may not use this file except in compliance with the License.
      *  You may obtain a copy of the License at
      *
      *          https://www.apache.org/licenses/LICENSE-2.0
      *
      *  Unless required by applicable law or agreed to in writing, software
      *  distributed under the License is distributed on an "AS IS" BASIS,
      *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      *  See the License for the specific language governing permissions and
      *  limitations under the License.
      */

      package io.spring.billusage.configuration;

      import javax.sql.DataSource;

      import org.springframework.cloud.aws.core.io.s3.PathMatchingSimpleStorageResourcePatternResolver;
      import org.springframework.context.annotation.Bean;
      import org.springframework.context.annotation.Configuration;

      @Configuration
      public class TaskProcessorConfiguration {

        @Bean
        public S3Processor s3Processor(
              PathMatchingSimpleStorageResourcePatternResolver resourcePatternResolver,
              DataSource dataSource) {
           return new S3Processor(resourcePatternResolver,dataSource);
        }
      }
      ```

   ```

   ```

#### Testing

Now let’s create our test. Replace the contents of the BillUsageApplicationTests.java with the following code:

        ```
        /*
        * Copyright 2019 the original author or authors.
        *
        *  Licensed under the Apache License, Version 2.0 (the "License");
        *  you may not use this file except in compliance with the License.
        *  You may obtain a copy of the License at
        *
        *          https://www.apache.org/licenses/LICENSE-2.0
        *
        *  Unless required by applicable law or agreed to in writing, software
        *  distributed under the License is distributed on an "AS IS" BASIS,
        *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
        *  See the License for the specific language governing permissions and
        *  limitations under the License.
        */

        package io.spring.billusage;

        import java.io.IOException;
        import java.sql.ResultSet;
        import java.sql.SQLException;
        import java.util.List;

        import io.spring.billusage.configuration.S3Processor;
        import io.spring.billusage.configuration.TaskProcessorConfiguration;
        import io.spring.billusage.configuration.Usage;
        import javax.sql.DataSource;
        import org.junit.Test;
        import org.junit.runner.RunWith;

        import org.springframework.boot.autoconfigure.AutoConfigurations;
        import org.springframework.boot.autoconfigure.jdbc.EmbeddedDataSourceConfiguration;
        import org.springframework.boot.test.context.runner.ApplicationContextRunner;
        import org.springframework.cloud.aws.core.io.s3.PathMatchingSimpleStorageResourcePatternResolver;
        import org.springframework.context.annotation.Bean;
        import org.springframework.context.annotation.Configuration;
        import org.springframework.core.io.ByteArrayResource;
        import org.springframework.core.io.Resource;
        import org.springframework.jdbc.core.JdbcTemplate;
        import org.springframework.jdbc.core.RowMapper;
        import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
        import org.springframework.test.context.junit4.SpringRunner;

        import static org.assertj.core.api.Assertions.assertThat;
        import static org.mockito.ArgumentMatchers.anyString;
        import static org.mockito.Mockito.mock;
        import static org.mockito.Mockito.when;

        @RunWith(SpringRunner.class)
        public class BillusageApplicationTests {

          @Test
          public void testRepository() {
             ApplicationContextRunner applicationContextRunner = new ApplicationContextRunner()
                   .withConfiguration(
                         AutoConfigurations.of(EmbeddedDataSourceConfiguration.class, TaskProcessorConfiguration.class,
                               TestConfiguration.class));
             applicationContextRunner.run((context) -> {
                DataSource dataSource = context.getBean(DataSource.class);
                S3Processor s3Processor = context.getBean(S3Processor.class);
                initializeDatabase(dataSource);
                s3Processor.processResources();
                List<Usage> usages = getResultsFromDB(dataSource);
                assertThat(usages.size()).isEqualTo(1);
                assertThat(usages.get(0).getId()).isEqualTo(1);
                assertThat(usages.get(0).getFirstName()).isEqualTo("jane");
             });
          }

          public void initializeDatabase(DataSource dataSource) {
             JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
             jdbcTemplate.execute("CREATE TABLE BILL_USAGE ( id int, first_name varchar(50), last_name varchar(50), minutes int, data_usage int)");
          }

          public List<Usage> getResultsFromDB(DataSource dataSource) {
                NamedParameterJdbcTemplate jdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
                return jdbcTemplate.query("select ID, FIRST_NAME, LAST_NAME, MINUTES, DATA_USAGE FROM BILL_USAGE", new UsageRowMapper());
          }


          @Configuration
          public static class TestConfiguration {

             @Bean
             public PathMatchingSimpleStorageResourcePatternResolver pathMatchingSimpleStorageResourcePatternResolver() throws IOException {
                PathMatchingSimpleStorageResourcePatternResolver pathMatchingResourceResolver = mock(PathMatchingSimpleStorageResourcePatternResolver.class);
                Resource[] resources = {new ByteArrayResource(
                      ("[{\"id\":\"1\",\"firstName\":\"jane\",\"lastName\":\"doe\"," +
                            "\"minutes\":\"500\",\"dataUsage\":\"1000\"}]").getBytes())};
                when(pathMatchingResourceResolver.getResources(anyString())).thenReturn(resources);

                return pathMatchingResourceResolver;

             }
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

#### Deployment

Deploy to local, Cloud Foundry and Kubernetes

##### Local

1. Now let’s take the next step of building the project.
   From a command line change directory to the location of your project and build the project using maven
   `cd <your project directory> mvn clean package`

Now let’s execute the application with the configurations required to pull the data from the s3 bucket and write the results to the MySql database

1. To configure the execution of the billrun application utilize the following arguments:

   1. _spring.datasource.url_ - set the URL to your database instance. In the sample below we are connecting to a mysql `practice` database on our local machine at port 3306.
   1. _spring.datasource.username_ - the user name to be used for the MySql database. In the sample below it is `root`
   1. _spring.datasource.password_ - the password to be used for the MySql database. In the sample below it is `password`
   1. _spring.datasource.driverClassName_ - The driver to use to connect to the MySql database. In the sample below it is `com.mysql.jdbc.Driver'
   1. _spring.datasource.initialization-mode_ - initializes the database with the BILL_USAGE table required for this app. In the sample below we state that we `always` want to do this. This will not overwrite the tables if they already exist.
   1. _cloud.aws.credentials.accessKey_ - the access key provided to you when you created your credentials on AWS. In the sample below we left it with a marker of `<your access key>`
   1. _cloud.aws.credentials.secretKey_ - the secret key provided to you when you created your credentials on AWS. In the sample below we left it with a marker of `<your secret key>`
   1. _cloud.aws.region.static_ - Configures a static region for the application. The sample below uses `us-east-1`.
   1. _cloud.aws.stack.auto_ - Enables the automatic stack name detection for the application. The sample below sets the value to `false`.
   1. _cloud.aws.region.auto_ - Enables automatic region detection based on the EC2 meta data service. The sample below sets the value to `false`.

   ```
   java -jar target/billusage-0.0.1-SNAPSHOT.jar --cloud.aws.credentials.accessKey=<your access key> --cloud.aws.credentials.secretKey=<your secret key> --cloud.aws.region.static=us-east-1 --cloud.aws.stack.auto=false --cloud.aws.region.auto=false --spring.datasource.url=jdbc:mysql://localhost:3306/practice?useSSL=false  --spring.datasource.username=root --spring.datasource.password=password --spring.datasource.driverClassName=com.mysql.jdbc.Driver --spring.datasource.initialization-mode=always
   ```

##### Cloud Foundry

As Alana I must ask for an org/space

##### Kubernetes

Where all the cool kids play.

### Bill Run

For this section we will create a Spring Cloud Task/Spring Batch Boot application that will read the BILL_USAGE table containing customer usage data from the database and price each entry and place the result into the BILL_STATEMENTS table.  
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

#### Initialzr

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

#### Biz Logic

1.  In your favorite IDE create a `configuration` package under the `io.spring.billrun` package
1.  Create a `Usage` class in the `io.spring.billrun.configuration` using your favorite IDE.

    1. Now copy and paste the code below into the Usage class

       ```
       /*
       * Copyright 2019 the original author or authors.
       *
       *  Licensed under the Apache License, Version 2.0 (the "License");
       *  you may not use this file except in compliance with the License.
       *  You may obtain a copy of the License at
       *
       *          https://www.apache.org/licenses/LICENSE-2.0
       *
       *  Unless required by applicable law or agreed to in writing, software
       *  distributed under the License is distributed on an "AS IS" BASIS,
       *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       *  See the License for the specific language governing permissions and
       *  limitations under the License.
       */

       package io.spring.billrun.configuration;

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

         @Override
         public String toString() {
            return "Usage{" +
                  "id=" + id +
                  ", firstName='" + firstName + '\'' +
                  ", lastName='" + lastName + '\'' +
                  ", minutes=" + minutes +
                  ", dataUsage=" + dataUsage +
                  '}';
         }
       }
       ```

1.  Create a `Bill` class in the `io.spring.billrun.configuration` using your favorite IDE.

    1. Now copy and paste the code below into the Bill class

       ```
       /*
       * Copyright 2019 the original author or authors.
       *
       *  Licensed under the Apache License, Version 2.0 (the "License");
       *  you may not use this file except in compliance with the License.
       *  You may obtain a copy of the License at
       *
       *          https://www.apache.org/licenses/LICENSE-2.0
       *
       *  Unless required by applicable law or agreed to in writing, software
       *  distributed under the License is distributed on an "AS IS" BASIS,
       *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       *  See the License for the specific language governing permissions and
       *  limitations under the License.
       */

       package io.spring.billrun.configuration;

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

1.  Create a BillProcessor class in the `io.spring.billrun.configuration` using your favorite IDE.

    1. Now copy and paste the code below into the BillProcessor class

       ```
       /*
       * Copyright 2019 the original author or authors.
       *
       *  Licensed under the Apache License, Version 2.0 (the "License");
       *  you may not use this file except in compliance with the License.
       *  You may obtain a copy of the License at
       *
       *          https://www.apache.org/licenses/LICENSE-2.0
       *
       *  Unless required by applicable law or agreed to in writing, software
       *  distributed under the License is distributed on an "AS IS" BASIS,
       *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       *  See the License for the specific language governing permissions and
       *  limitations under the License.
       */

       package io.spring.billrun.configuration;

       import org.springframework.batch.item.ItemProcessor;

       public class BillProcessor implements ItemProcessor<Usage, Bill> {

         @Override
         public Bill process(Usage usage) {

            Double billAmount = usage.getDataUsage() * .001 + usage.getMinutes() * .01;
            return new Bill(usage.getId(), usage.getFirstName(), usage.getLastName(),
                  usage.getDataUsage(), usage.getMinutes(), billAmount);
         }
       }
       ```

1.  Create a BillingConfiguration class in the `io.spring.billrun.configuration` using your favorite IDE.

    1.  Now copy and paste the code below into the BillingConfiguration class

            ```
            /*
            * Copyright 2019 the original author or authors.
            *
            *  Licensed under the Apache License, Version 2.0 (the "License");
            *  you may not use this file except in compliance with the License.
            *  You may obtain a copy of the License at
            *
            *          https://www.apache.org/licenses/LICENSE-2.0
            *
            *  Unless required by applicable law or agreed to in writing, software
            *  distributed under the License is distributed on an "AS IS" BASIS,
            *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
            *  See the License for the specific language governing permissions and
            *  limitations under the License.
            */

            package io.spring.billrun.configuration;

            import javax.sql.DataSource;
            import org.apache.commons.logging.Log;
            import org.apache.commons.logging.LogFactory;

            import org.springframework.batch.core.Job;
            import org.springframework.batch.core.Step;
            import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
            import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
            import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
            import org.springframework.batch.item.ItemProcessor;
            import org.springframework.batch.item.ItemReader;
            import org.springframework.batch.item.ItemWriter;
            import org.springframework.batch.item.database.JdbcBatchItemWriter;
            import org.springframework.batch.item.database.JdbcCursorItemReader;
            import org.springframework.batch.item.database.builder.JdbcBatchItemWriterBuilder;
            import org.springframework.batch.item.database.builder.JdbcCursorItemReaderBuilder;
            import org.springframework.beans.factory.annotation.Autowired;
            import org.springframework.beans.factory.annotation.Value;
            import org.springframework.context.annotation.Bean;
            import org.springframework.context.annotation.Configuration;
            import org.springframework.core.io.Resource;


            @Configuration
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

1.  Now that we have created a billing app using Spring Batch now let’s make it a the Spring Cloud Task by adding `@EnableTask` to the BillrunApplication. Overwrite the contents of the BillrunApplication with the contents below:
    package io.spring.billrun;

        ```
        import org.springframework.boot.SpringApplication;
        import org.springframework.boot.autoconfigure.SpringBootApplication;
        import org.springframework.cloud.task.configuration.EnableTask;

        @SpringBootApplication
        @EnableTask
        public class BillrunApplication {

          public static void main(String[] args) {
             SpringApplication.run(BillrunApplication.class, args);
          }
        }
        ```

#### Testing

Now let’s create our test. Replace the contents of the BillrunApplicationTests.java with the following code:

```
package io.spring.billrun;

import java.util.List;

import io.spring.billrun.configuration.Usage;
import javax.sql.DataSource;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.springframework.batch.core.JobExecution;
import org.springframework.batch.test.JobLauncherTestUtils;
import org.springframework.batch.test.context.SpringBatchTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;

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
     initializeDatabase();
  }

  @Test
  public void testJobResults() throws Exception{
     JobExecution jobExecution = jobLauncherTestUtils.launchJob();
     Assert.assertEquals("COMPLETED", jobExecution.getExitStatus().getExitCode());
     testResult();
  }


  private void testResult() {
     List<BillStatement> billStatements = this.jdbcTemplate.query("select ID, " +
                 "first_name, last_name, minutes, data_usage, bill_amount FROM bill_statements",
           (rs, rowNum) -> new BillStatement(rs.getLong("id"),
                 rs.getString("FIRST_NAME"), rs.getString("LAST_NAME"),
                 rs.getLong("MINUTES"), rs.getLong("DATA_USAGE"),
                 rs.getDouble("bill_amount")));
     assertThat(billStatements.size()).isEqualTo(1);

     BillStatement billStatement = billStatements.get(0);
     assertThat(billStatement.getBillAmount()).isEqualTo(2.5);
     assertThat(billStatement.getFirstName()).isEqualTo("jane");
     assertThat(billStatement.getLastName()).isEqualTo("doe");
     assertThat(billStatement.getId()).isEqualTo(1);
     assertThat(billStatement.getMinutes()).isEqualTo(200);
     assertThat(billStatement.getDataUsage()).isEqualTo(500);

  }

  public void initializeDatabase() {
     this.jdbcTemplate.execute("INSERT INTO bill_usage (id, first_name, " +
           "last_name, minutes, data_usage) values (1, 'jane', 'doe', 200, 500)");
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

#### Deployment

Deploy to local, Cloud Foundry and Kubernetes

##### Local

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
    1. _spring_batch_initialize-schema_ - initializes the database with the tables required for Spring Batch. In the sample below we state that we `always` want to do this. This will not overwrite the tables if they already exist.

    ```
    java -jar target/billrun-0.0.1-SNAPSHOT.jar --spring.datasource.url=jdbc:mysql://localhost:3306/practice?useSSL=false --spring.datasource.username=root --spring.datasource.password=password --spring.datasource.driverClassName=com.mysql.jdbc.Driver --spring.datasource.initialization-mode=always --spring_batch_initialize-schema=always
    ```

##### Cloud Foundry

As Alana I must ask for an org/space

##### Kubernetes

Where all the cool kids play.
