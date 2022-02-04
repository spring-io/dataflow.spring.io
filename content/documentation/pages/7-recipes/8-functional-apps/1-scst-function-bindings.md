---
path: 'recipes/functional-apps/scst-function-bindings/'
title: 'Functional Applications'
description: 'Configuring the Spring Cloud Stream Functional applications'
---

# Building Streaming Data Pipeline using Functional applications

This recipe describes how to build simple function-based applications by using Spring Cloud Stream and have them embedded into the Spring Cloud Data Flow Streaming data pipeline.

## Overview

We create a `time-source` application that produces the current date or timestamp at a configured interval and sends it to the messaging middleware. We also create a sink `log-sink` application to consume the published messages from the middleware.

For more information on how Spring Cloud Stream provides this support, see the [Spring Cloud Stream documentation](https://cloud.spring.io/spring-cloud-static/spring-cloud-stream/current/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-producing-consuming-messages).

With Spring Cloud Stream 3.x as the dependency, you can write the `Source` application by using `java.util.function.Supplier`, as follows:

```Java
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

Spring Cloud Stream provides `spring.cloud.stream.poller.DefaultPollerProperties`, which you can configure to trigger the `Supplier` function, `timeSupplier()`.
For instance, you can use `--spring.cloud.stream.poller.fixed-delay=5000` property to trigger this `Supplier` function every five seconds.

Similarly, you can write a `Sink` application using `java.util.function.Consumer`, as follows:

```Java
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

After building both the `time-source` and the `log-sink` applications, you can register these applications into Spring Cloud Data Flow.

Suppose you create a stream by using these applications, as follows:

```
ticktock=time-source | log-sink
```

You need to make sure that the functional bindings of these applications are mapped to the appropriate `output` and `input` names that Spring Cloud Data Flow understands.

What this means is that you need to configure the following properties when deploying the stream:

```
app.time-source.spring.cloud.stream.function.bindings.timeSupplier-out-0=output
app.log-sink.spring.cloud.stream.function.bindings.logConsumer-in-0=input
```

The `timeSupplier` function's output and `logConsumer` function's input need to be mapped to the outbound and inbound names that Spring Cloud Data Flow understands: `output` and `input`.

Along with this, you also need to provide a way to trigger the `Supplier` function -- in this case:

```
app.time-source.spring.cloud.stream.poller.fixed-delay=5000
```

If you run this by using `local` deployer, you can also inherit the logs from the applications into the Skipper server log so that you can see the `ticktock` stream messages at the `log-sink` consumer at Skipper server log:

```
deployer.*.local.inherit-logging=true
```

## Using Functional Applications with Other Versions of Spring Cloud Stream Applications

You can use your functional application with other versions of Spring Cloud Stream application (for example, applications that use `@EnableBinding` to explicitly declare their inbound and outbound endpoints).

In this case, you need to explicitly configure the functional binding **only** on your functional application.

For instance, suppose you use the `time` source application from the [stream-app-starters](https://github.com/spring-cloud-stream-app-starters/time/blob/17ce146a0049d0259e12a39a80ae57c4ea148258/spring-cloud-starter-stream-source-time/src/main/java/org/springframework/cloud/stream/app/time/source/TimeSourceConfiguration.java#L36). Then your `TimeSourceConfiguration` class would need to be as follows:

```Java
@EnableBinding(Source.class)
@Import({TriggerConfiguration.class, TriggerPropertiesMaxMessagesDefaultOne.class})
public class TimeSourceConfiguration {

	@Autowired
	private TriggerProperties triggerProperties;

	@PollableSource
	public String publishTime() {
		return new SimpleDateFormat(this.triggerProperties.getDateFormat()).format(new Date());
	}

}
```

Further suppose that you use the `log-sink` consumer application that we used earlier:

```Java
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

Further suppose you create a stream byusing `time` and `log-sink` in SCDF, as follows:

```
ticktock=time | log-sink
```

Then you need to configure the function bindings only on the `log-sink`, as the `time` application would have its `output` bound by using `@EnableBidning`. The following example shows how to do so:

```
app.log-sink.spring.cloud.stream.function.bindings.logConsumer-in-0=input
```
