package com.example.casa.Util;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;

public class DateConverter {

	public static Date ISO2Date(String isoString) {
		try {
			ZonedDateTime zonedDateTime = ZonedDateTime.parse(isoString, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
			return Date.from(zonedDateTime.toInstant());
		} catch (Exception e) {
			return new Date(0);
		}
	}

	public static String Date2ISO(Date datetime) {
		return DateTimeFormatter.ISO_INSTANT.format(datetime.toInstant());
	}

	public static String Calendar2ISO(Calendar calendar) {
		return Date2ISO(calendar.getTime());
	}

	public static String numbers2ISO(int year, int month, int day, int hour, int minute, int second) {
		Calendar calendar = Calendar.getInstance();
		calendar.set(year, month, day, hour, minute, second);
		return Calendar2ISO(calendar);
	}

	public static String numbers2ISO(int year, int month, int day) {
		return numbers2ISO(year, month, day, 0, 0, 0);
	}
}
