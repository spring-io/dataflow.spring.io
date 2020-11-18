---
path: 'applications/migration/ftp-source'
title: 'ftp-source Migration'
description: 'ftp-source Migration'
keywords:
  - application
  - migration
  - ftp-source
toc: true
summary: false
hidden: true
---

# ftp-source

## Properties

| Property                    | 2.x Name                   | 3.x Name                           |
| --------------------------- | -------------------------- | ---------------------------------- |
| **_auto-create-local-dir_** | ftp.auto-create-local-dir  | ftp.supplier.auto-create-local-dir |
| **_cache-sessions_**        | ftp.factory.cache-sessions | ftp.factory.cache-sessions         |
| **_client-mode_**           | ftp.factory.client-mode    | ftp.factory.client-mode            |
| **_delete-remote-files_**   | ftp.delete-remote-files    | ftp.supplier.delete-remote-files   |
| **_filename-pattern_**      | ftp.filename-pattern       | ftp.supplier.filename-pattern      |
| **_filename-regex_**        | ftp.filename-regex         | ftp.supplier.filename-regex        |
| **_host_**                  | ftp.factory.host           | ftp.factory.host                   |
| **_local-dir_**             | ftp.local-dir              | ftp.supplier.local-dir             |
| **_markers-json_**          | file.consumer.markers-json | file.consumer.markers-json         |
| **_mode_**                  | file.consumer.mode         | file.consumer.mode                 |
| **_password_**              | ftp.factory.password       | ftp.factory.password               |
| **_port_**                  | ftp.factory.port           | ftp.factory.port                   |
| **_preserve-timestamp_**    | ftp.preserve-timestamp     | ftp.supplier.preserve-timestamp    |
| **_remote-dir_**            | ftp.remote-dir             | ftp.supplier.remote-dir            |
| **_remote-file-separator_** | ftp.remote-file-separator  | ftp.supplier.remote-file-separator |
| **_tmp-file-suffix_**       | ftp.tmp-file-suffix        | ftp.supplier.tmp-file-suffix       |
| **_username_**              | ftp.factory.username       | ftp.factory.username               |
| **_with-markers_**          | file.consumer.with-markers | file.consumer.with-markers         |
