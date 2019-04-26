---
path: 'feature-guides/streams/function-composition/'
title: 'Composing Functions'
description: 'Adding a function to an existing application.'
---

With the function composition, you can attach a functional logic dynamically to an existing event streaming application. The business logic is a mere implementation of `java.util.Function`, `java.util.Supplier` or `java.util.Consumer` interfaces that map to `processor`, `source` and `sink`, respectively.

If you have a functional logic implemented using `java.util.Function`, you can represent this `java.util.Function` as a Spring Cloud Data Flow `processor` and attach it to an existing source or sink application. The function composition in this context could be the source and processor combined in one single application: a “new source,” or it could be the processor and sink combined into a single application: “a new sink.” Either way, the transformation logic represented in the `processor` application can be composed into a `source` or `sink` application without having to develop a separate `processor` application.
