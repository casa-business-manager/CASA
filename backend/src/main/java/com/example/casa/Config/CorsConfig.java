package com.example.casa.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    //Placeholder Cors Configuration for the time being, when deployed to a web-server, this should be changed to the actual domain
    /*CorsFilter, is a filter that will handle the CORS requests. It is used to allow the frontend to make requests to the backend.
    The filter is configured to allow any origin, any header, and any method. The filter is also configured to allow credentials (cookies, etc.)
    The filter is registered to handle all requests ("/**").*/
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        //config.addAllowedOrigin("https://example.com"); // Specify your allowed domain
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        //config.addExposedHeader("Custom-Header-Name"); // Specify headers that should be exposed to the client
        config.setMaxAge(3600L); // Set preflight cache duration in seconds
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}

