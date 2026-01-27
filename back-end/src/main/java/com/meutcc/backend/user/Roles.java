package com.meutcc.backend.user;

import com.meutcc.backend.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_roles")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Roles extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;
}
