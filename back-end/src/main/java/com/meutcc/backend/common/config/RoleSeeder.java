package com.meutcc.backend.common.config;


import com.meutcc.backend.role.RoleRepository;
import com.meutcc.backend.role.Roles;
import lombok.AllArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.core.annotation.Order;

import java.util.List;

@Component
@AllArgsConstructor
@Order(1)
public class RoleSeeder implements ApplicationRunner {

    private RoleRepository roleRepository;

    public void run(ApplicationArguments args) {
        if (roleRepository.count() == 0) {
            roleRepository.saveAll(List.of(
                    new Roles((byte) 1, "ADMIN"),
                    new Roles((byte) 2, "TEACHER"),
                    new Roles((byte) 3, "STUDENT")
            ));
        }
    }
}
