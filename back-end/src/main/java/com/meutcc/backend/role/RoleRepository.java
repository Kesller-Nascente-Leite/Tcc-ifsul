package com.meutcc.backend.role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Roles, Byte> {
    // Para evitar duplicação no db
    Optional<Roles> findByName(String name);
}
