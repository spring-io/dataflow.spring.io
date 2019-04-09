package org.springframework.cloud.dataflow.core;

import org.springframework.util.StringUtils;

public class DefinitionUtils {

	public static String autoQuotes(String propertyValue) {

		if (!StringUtils.hasText(propertyValue)) {
			return propertyValue;
		}

		if (propertyValue.startsWith("\"") && propertyValue.endsWith("\"")) {
			return propertyValue;
		}

		if (!propertyValue.contains("'")) {
			if (propertyValue.contains(" ") || propertyValue.contains(";") || propertyValue.contains("*")) {
				return "'" + propertyValue + "'";
			}
		}
		else {
			if (propertyValue.contains(" ") || propertyValue.contains(";") || propertyValue.contains("*")) {
				return "\"" + propertyValue + "\"";
			}
		}

		return propertyValue;
	}
}