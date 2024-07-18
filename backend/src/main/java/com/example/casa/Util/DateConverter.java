package com.example.casa.Util;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class DateConverter {

	public static Date ISO2Date(String isoString) {
		try {
			ZonedDateTime zonedDateTime = ZonedDateTime.parse(isoString, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
			return Date.from(zonedDateTime.toInstant());
		} catch(Exception e) {
			return new Date(0);
		}
	}
}
