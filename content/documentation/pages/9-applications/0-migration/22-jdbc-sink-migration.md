---
path: 'applications/migration/jdbc-sink'
title: 'jdbc-sink Migration'
description: 'jdbc-sink Migration'
keywords:
  - application
  - migration
  - jdbc-sink
toc: true
summary: false
hidden: true
---

# jdbc-sink

## Properties

| Property                  | 2.x Name                              | 3.x Name                              |
| ------------------------- | ------------------------------------- | ------------------------------------- |
| **_batch-size_**          | jdbc.batch-size                       | jdbc.consumer.batch-size              |
| **_columns_**             | jdbc.columns                          | jdbc.consumer.columns                 |
| **_data_**                | spring.datasource.data                | spring.datasource.data                |
| **_driver-class-name_**   | spring.datasource.driver-class-name   | spring.datasource.driver-class-name   |
| **_idle-timeout_**        | jdbc.idle-timeout                     | jdbc.consumer.idle-timeout            |
| **_initialization-mode_** | spring.datasource.initialization-mode | spring.datasource.initialization-mode |
| **_initialize_**          | jdbc.initialize                       | jdbc.consumer.initialize              |
| **_password_**            | spring.datasource.password            | spring.datasource.password            |
| **_schema_**              | spring.datasource.schema              | spring.datasource.schema              |
| **_table-name_**          | jdbc.table-name                       | jdbc.consumer.table-name              |
| **_url_**                 | spring.datasource.url                 | spring.datasource.url                 |
| **_username_**            | spring.datasource.username            | spring.datasource.username            |
