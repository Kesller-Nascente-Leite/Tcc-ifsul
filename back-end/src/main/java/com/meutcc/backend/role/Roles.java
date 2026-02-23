package com.meutcc.backend.role;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_roles")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Roles {

    @Id
    private byte id;
    @Column(nullable = false, unique = true)
    private String name;
}
