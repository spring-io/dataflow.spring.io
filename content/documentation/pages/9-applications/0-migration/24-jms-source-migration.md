---
path: 'applications/migration/jms-source'
title: 'jms-source Migration'
description: 'jms-source Migration'
keywords:
  - application
  - migration
  - jms-source
toc: true
summary: false
hidden: true
---

# jms-source

## Properties

| Property                   | 2.x Name                             | 3.x Name                             |
| -------------------------- | ------------------------------------ | ------------------------------------ |
| **_acknowledge-mode_**     | spring.jms.listener.acknowledge-mode | spring.jms.listener.acknowledge-mode |
| **_auto-startup_**         | spring.jms.listener.auto-startup     | spring.jms.listener.auto-startup     |
| **_client-id_**            | jms.client-id                        | jms.supplier.client-id               |
| **_concurrency_**          | spring.jms.listener.concurrency      | spring.jms.listener.concurrency      |
| **_destination_**          | jms.destination                      | jms.supplier.destination             |
| **_jndi-name_**            | spring.jms.jndi-name                 | spring.jms.jndi-name                 |
| **_max-concurrency_**      | spring.jms.listener.max-concurrency  | spring.jms.listener.max-concurrency  |
| **_message-selector_**     | jms.message-selector                 | jms.supplier.message-selector        |
| **_pub-sub-domain_**       | spring.jms.pub-sub-domain            | spring.jms.pub-sub-domain            |
| **_receive-timeout_**      | spring.jms.listener.receive-timeout  | spring.jms.listener.receive-timeout  |
| **_session-transacted_**   | jms.session-transacted               | jms.supplier.session-transacted      |
| **_subscription-durable_** | jms.subscription-durable             | jms.supplier.subscription-durable    |
| **_subscription-name_**    | jms.subscription-name                | jms.supplier.subscription-name       |
| **_subscription-shared_**  | jms.subscription-shared              | jms.supplier.subscription-shared     |
