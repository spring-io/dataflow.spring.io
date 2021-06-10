---
path: 'installation/migration/migration-2-7-to-2-8'
title: 'Migrate from 2.7 to 2.8'
description: 'Migrating Spring Cloud Data Flow from version 2.7 to 2.8'
---

# Composed Task Property Syntax

In the 2.8 release of Spring Cloud Data Flow the syntax for specifying properties has been simplified.
In the past the syntax for setting a property in composed task runner was as follows:
`app.<composed task definition name>.<app label>.property`. We have removed the
requirement that you have to specify the `Composed Task Definition Name`, so now to set a property
for a composed task looks like `app.<app label>.property`. The old property format is still supported,
but it is encouraged to use the new format.

<!--NOTE-->

**NOTE:** You can read more about setting composed task properties [here](%currentPath%/feature-guides/batch/composed-task/#setting-property-at-composed-task-launch-time).

<!--END_NOTE-->

# Microsoft SQL Server

In 2.8 there have been some modifications to the Spring Cloud Data Flow schema for Microsoft SQL Server.
The `TASK_SEQ` sequence table has been replaced with a `TASK_SEQ` sequence. This
migration should occur when Spring Cloud Data Flow 2.8.x is run for the first time
on the database instance.
