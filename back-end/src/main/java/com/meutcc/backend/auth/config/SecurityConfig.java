package com.meutcc.backend.auth.config;

import com.meutcc.backend.auth.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.LogoutConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    @Autowired
    private final AuthService authService;

    @Bean
    public UserDetailsService userDetailsService() {
        return authService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder()); //Vai checar se a senha está correta ou não
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        return httpSecurity
                .formLogin(httpForm ->
                        httpForm.loginPage("/login").permitAll()
                                .usernameParameter("email")) // Em vez de username é email para fazer o login
                .logout(LogoutConfigurer::permitAll)

                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable()) // Desabilitado por enquanto,

                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                //Autorizar requisições
                .authorizeHttpRequests(authorize -> authorize
                        //definindo quem pode acessar oq
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("Admin")
                        .requestMatchers("/api/teacher/**").hasRole("Professor")
                        .requestMatchers("/api/student/**").hasRole("Estudante")
                        // linhas abaixo é para que todas as outras rotas terao a necessidade de estar logado
                        .anyRequest()
                        .authenticated())

                .httpBasic(Customizer.withDefaults())// Todos requests precisao ser autenticadas aq para passar no projeto
                .build();
    }
}