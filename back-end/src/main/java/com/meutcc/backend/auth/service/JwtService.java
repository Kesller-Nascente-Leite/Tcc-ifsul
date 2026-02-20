package com.meutcc.backend.auth.service;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import java.util.ArrayList;
import java.util.Collection;

@Configuration
public class JwtConfig {

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new CustomAuthoritiesConverter());
        return converter;
    }

    static class CustomAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
        @Override
        public Collection<GrantedAuthority> convert(Jwt jwt) {
            Collection<GrantedAuthority> authorities = new ArrayList<>();

            // Tenta ler de "authorities" primeiro
            Object authoritiesClaim = jwt.getClaim("authorities");
            if (authoritiesClaim instanceof Collection<?>) {
                for (Object auth : (Collection<?>) authoritiesClaim) {
                    authorities.add(new SimpleGrantedAuthority(auth.toString()));
                }
                return authorities;
            }

            // Fallback para "role"
            String role = jwt.getClaim("role");
            if (role != null) {
                authorities.add(new SimpleGrantedAuthority(role));
            }

            return authorities;
        }
    }
}