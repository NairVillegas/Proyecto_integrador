package com.flamabrava.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  // …

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      // primero, habilitamos CORS
      .cors().and()
      // y luego puedes desactivar CSRF si estás sacando todos los endpoints como REST
      .csrf().disable()
      // tu configuración de rutas, autenticación, etc.
      .authorizeHttpRequests(auth -> auth
         .requestMatchers("/api/**").permitAll()
         // … otras reglas …
      );

    return http.build();
  }

  // Este bean define tu política CORS para Spring Security
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    // aquí debes incluir _exactamente_ el origen donde corre tu React
    config.setAllowedOrigins(List.of(
      "http://localhost:3000",
      "https://polleriaflamabrava.netlify.app",
      "https://flamabrava.onrender.com"
    ));
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    // aplica CORS a todas las rutas /api/**
    source.registerCorsConfiguration("/api/**", config);
    return source;
  }
}
