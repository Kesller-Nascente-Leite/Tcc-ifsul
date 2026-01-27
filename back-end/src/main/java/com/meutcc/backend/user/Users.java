package com.meutcc.backend.user;

import com.meutcc.backend.content.mapper.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tb_users")
@Data
public class Users extends BaseEntity {

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
