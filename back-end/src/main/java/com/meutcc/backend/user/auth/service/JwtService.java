package com.meutcc.backend.user.auth.service;

import com.meutcc.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class JwtService {

    @Autowired
    private JwtEncoder jwtEncoder;

    public String generateTokenForUser(User user,Long expiresIn) {
        Instant now = Instant.now();

        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiresIn))
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("authorities", List.of(user.getRole().getName()))
                .claim("fullName", user.getFullName())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().getName())
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
    }
}
