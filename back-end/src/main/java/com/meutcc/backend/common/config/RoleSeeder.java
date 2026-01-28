package com.meutcc.backend.common.config;

import com.meutcc.backend.user.RoleRepository;
import com.meutcc.backend.user.Roles;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class RoleSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        List<String> roleNames = List.of("Admin", "Professor", "Aluno");

        roleNames.forEach(roleName -> {
                    if (roleRepository.findByName(roleName).isEmpty()) {
                        Roles newRole = new Roles();
                        newRole.setName(roleName);
                        roleRepository.save(newRole);
                    }
                }
        );
    }
}
