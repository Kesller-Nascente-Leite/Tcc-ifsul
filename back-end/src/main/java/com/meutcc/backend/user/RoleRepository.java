package com.meutcc.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Roles, Long> {
    // Para evitar duplicação no db
    Optional<Roles> findByName(String name);
}
