---
path: 'recipes/functional-apps/scst-function-bindings/'
title: 'Functional Applications'
description: 'Configuring the Spring Cloud Stream Functional applications'
---

# Building Streaming Data Pipeline using Functional applications

To learn how to build simple Function-based applications using Spring Cloud Stream and have them embedded into the Spring Cloud Data Flow Streaming data pipeline.

## Overview

Let's create a `time-source` application that produces the current date/timestamp at a configured interval to the messaging middleware, and the sink `log-sink` consumes the published messages from the middleware.

For more information on how Spring Cloud Stream provides this support, you can refer the Spring Cloud Stream [documentation](https://cloud.spring.io/spring-cloud-static/spring-cloud-stream/current/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-producing-consuming-messages).

The following sample applications are available in Spring Cloud Data Flow samples [repo](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/spring-cloud-stream-function-bindings).

With Spring Cloud Stream 3.x as the dependency, you can write the `Source` application using `java.util.function.Supplier` as follows:

```
package com.example.timesource;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.function.Supplier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TimeSourceApplication {

	@Bean
	public Supplier<String> timeSupplier() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		return () -> {
			return sdf.format(new Date());
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(TimeSourceApplication.class, args);
	}

}

```

Spring Cloud Stream provides `spring.cloud.stream.poller.DefaultPollerProperties` which can be configured to trigger the `Supplier` function `timeSupplier()` above.
For instance, you can use `--spring.cloud.stream.poller.fixed-delay=5000` property to trigger this `Supplier` function every 5s.

Similarly, You can write a `Sink` application using `java.util.function.Consumer` as follows:

```
package com.example.logsink;

import java.util.function.Consumer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.dsl.IntegrationFlows;
import org.springframework.integration.handler.LoggingHandler;
import org.springframework.messaging.Message;

@SpringBootApplication
public class LogSinkApplication {

	@Bean
	IntegrationFlow logConsumerFlow() {
		return IntegrationFlows.from(MessageConsumer.class, (gateway) -> gateway.beanName("logConsumer"))
				.handle((payload, headers) -> {
					if (payload instanceof byte[]) {
						return new String((byte[]) payload);
					}
					return payload;
				})
				.log(LoggingHandler.Level.INFO, "log-consumer", "payload")
				.get();
	}

	private interface MessageConsumer extends Consumer<Message<?>> {}

	public static void main(String[] args) {
		SpringApplication.run(LogSinkApplication.class, args);
	}
}


```

After building both the `time-source` and `log-sink` applications, you can register these applications into Spring Cloud Data Flow.

Let's say you create a stream using these applications as follows:

```
ticktock=time-source | log-sink
```

You need to make sure that the functional bindings of these applications are mapped to the appropriate `output` and `input` names that Spring Cloud Data Flow understands.

What this means is that you need to configure the following properties when deploying the stream:

```
app.time-source.spring.cloud.stream.function.bindings.timeSupplier-out-0=output
app.log-sink.spring.cloud.stream.function.bindings.logConsumer-in-0=input
```

The timeSupplier function's output and `logConsumer` function's input need to be mapped to the outbound/inbound names that Spring Cloud Data Flow understands: `output` and `input`.

Along with this, you also need to provide a way trigger the `Supplier` function. In this case,

```
app.time-source.spring.cloud.stream.poller.fixed-delay=5000
```

If you are running this using `local` deployer, you can also inherit the logs from the applications into Skipper server log so that you can see the `ticktock` stream messages at the `log-sink` consumer at Skipper server log.

```
deployer.*.local.inherit-logging=true
```
