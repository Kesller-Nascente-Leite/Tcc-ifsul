package com.meutcc.backend.common.utils;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        // Definindo que vou usar o BCrypt para criptografar a senha
        return new BCryptPasswordEncoder();
    }

    // Defini quem pode acessar oq
    @Bean
    public SecurityFilterChain segurityFilterChain(HttpSecurity http) throws Exception {
        // Futuramente usar o jwt e o OAuth2 para mexer com tokens
        http
                .csrf(csrf -> csrf.disable()) // Desabilitado por enquanto,
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/register").permitAll() //permite que qualquer pessoa possa se registrar
                        .anyRequest()
                        .authenticated())
                .httpBasic(Customizer.withDefaults());// Todos requests precisao ser autenticadas aq para passar no projeto


        return http.build();
    }
}
