package com.meutcc.backend.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_users")
@EqualsAndHashCode
@Data
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "full_name")
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "role_id")
    private Roles role;

    @Column(nullable = false)
    private boolean active = true;
}
