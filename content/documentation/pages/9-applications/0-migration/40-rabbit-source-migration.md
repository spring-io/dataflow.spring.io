---
path: 'applications/migration/rabbit-source'
title: 'rabbit-source Migration'
description: 'rabbit-source Migration'
keywords:
  - application
  - migration
  - rabbit-source
toc: true
summary: false
hidden: true
---

# rabbit-source

## Properties

| Property                     | 2.x Name                               | 3.x Name                               |
| ---------------------------- | -------------------------------------- | -------------------------------------- |
| **_addresses_**              | spring.rabbitmq.addresses              | spring.rabbitmq.addresses              |
| **_connection-timeout_**     | spring.rabbitmq.connection-timeout     | spring.rabbitmq.connection-timeout     |
| **_enable-retry_**           | rabbit.enable-retry                    | rabbit.supplier.enable-retry           |
| **_host_**                   | spring.rabbitmq.host                   | spring.rabbitmq.host                   |
| **_initial-retry-interval_** | rabbit.initial-retry-interval          | rabbit.supplier.initial-retry-interval |
| **_mapped-request-headers_** | rabbit.mapped-request-headers          | rabbit.supplier.mapped-request-headers |
| **_max-attempts_**           | rabbit.max-attempts                    | rabbit.supplier.max-attempts           |
| **_max-retry-interval_**     | rabbit.max-retry-interval              | rabbit.supplier.max-retry-interval     |
| **_own-connection_**         | rabbit.own-connection                  | rabbit.supplier.own-connection         |
| **_password_**               | spring.rabbitmq.password               | spring.rabbitmq.password               |
| **_port_**                   | spring.rabbitmq.port                   | spring.rabbitmq.port                   |
| **_publisher-confirm-type_** | spring.rabbitmq.publisher-confirm-type | spring.rabbitmq.publisher-confirm-type |
| **_publisher-returns_**      | spring.rabbitmq.publisher-returns      | spring.rabbitmq.publisher-returns      |
| **_queues_**                 | rabbit.queues                          | rabbit.supplier.queues                 |
| **_requested-channel-max_**  | spring.rabbitmq.requested-channel-max  | spring.rabbitmq.requested-channel-max  |
| **_requested-heartbeat_**    | spring.rabbitmq.requested-heartbeat    | spring.rabbitmq.requested-heartbeat    |
| **_requeue_**                | rabbit.requeue                         | rabbit.supplier.requeue                |
| **_retry-multiplier_**       | rabbit.retry-multiplier                | rabbit.supplier.retry-multiplier       |
| **_transacted_**             | rabbit.transacted                      | rabbit.supplier.transacted             |
| **_username_**               | spring.rabbitmq.username               | spring.rabbitmq.username               |
| **_virtual-host_**           | spring.rabbitmq.virtual-host           | spring.rabbitmq.virtual-host           |
