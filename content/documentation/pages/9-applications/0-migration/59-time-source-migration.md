---
path: 'applications/migration/time-source'
title: 'time-source Migration'
description: 'time-source Migration'
keywords:
  - application
  - migration
  - time-source
toc: true
summary: false
hidden: true
---

# time-source

## Properties

| Property            | 2.x Name              | 3.x Name                                 |
| ------------------- | --------------------- | ---------------------------------------- |
| **_cron_**          | trigger.cron          | spring.cloud.stream.poller.cron          |
| **_date-format_**   | trigger.date-format   | time.date-format                         |
| **_fixed-delay_**   | trigger.fixed-delay   | spring.cloud.stream.poller.fixed-delay   |
| **_initial-delay_** | trigger.initial-delay | spring.cloud.stream.poller.initial-delay |
