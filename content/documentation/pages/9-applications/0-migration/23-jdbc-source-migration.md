---
path: 'applications/migration/jdbc-source'
title: 'jdbc-source Migration'
description: 'jdbc-source Migration'
keywords:
  - application
  - migration
  - jdbc-source
toc: true
summary: false
hidden: true
---

# jdbc-source

## Properties

| Property                  | 2.x Name                              | 3.x Name                                 |
| ------------------------- | ------------------------------------- | ---------------------------------------- |
| **_cron_**                | trigger.cron                          | spring.cloud.stream.poller.cron          |
| **_data_**                | spring.datasource.data                | spring.datasource.data                   |
| **_driver-class-name_**   | spring.datasource.driver-class-name   | spring.datasource.driver-class-name      |
| **_fixed-delay_**         | trigger.fixed-delay                   | spring.cloud.stream.poller.fixed-delay   |
| **_initial-delay_**       | trigger.initial-delay                 | spring.cloud.stream.poller.initial-delay |
| **_initialization-mode_** | spring.datasource.initialization-mode | spring.datasource.initialization-mode    |
| **_password_**            | spring.datasource.password            | spring.datasource.password               |
| **_query_**               | jdbc.query                            | jdbc.supplier.query                      |
| **_schema_**              | spring.datasource.schema              | spring.datasource.schema                 |
| **_split_**               | jdbc.split                            | jdbc.supplier.split                      |
| **_update_**              | jdbc.update                           | jdbc.supplier.update                     |
| **_url_**                 | spring.datasource.url                 | spring.datasource.url                    |
| **_username_**            | spring.datasource.username            | spring.datasource.username               |
