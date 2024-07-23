import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.services.calendar.Calendar;
import org.springframework.stereotype.Component;

@Component
public class GoogleCalendarUtil {

	public Calendar getCalendarService(User user) throws IOException {
		Credential credential = new GoogleCredential().setAccessToken(user.getProviderId());

		return new Calendar.Builder(
				com.google.api.client.http.javanet.NetHttpTransport.newTrustedTransport(),
				com.google.api.client.json.jackson2.JacksonFactory.getDefaultInstance(),
				credential)
						.setApplicationName("Your Application Name")
						.build();
	}
}
