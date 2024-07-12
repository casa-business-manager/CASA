package com.example.casa.Util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateConverter {

	private static final SimpleDateFormat isoDateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");

	public static Date ISO2Date(String isoString) {
		try {
			return isoDateFormatter.parse(isoString);
		} catch(Exception e) {
			return new Date(0);
		}
	}
}
