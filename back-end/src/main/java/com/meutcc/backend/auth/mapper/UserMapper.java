package com.meutcc.backend.auth.mapper;

import com.meutcc.backend.auth.dto.RegisterRequest;
import com.meutcc.backend.auth.dto.UserDTO;
import com.meutcc.backend.user.User;
import org.springframework.stereotype.Component;

/* assim que a dependencia do Mapper vier oficialmente para o spring, tirarei codigo, por agora, farei a mao mesmo

@Mapper(componentModel = "spring")
public interface UserMapper {
    //classe responsável por converter objetos DTO -> Entity e Entity -> DTO, nesse caso, interface
    User toEntity(RegisterRequest registerRequest);

    RequestResponse toResponse(User user);
}*/

@Component // Isso faz o Spring "enxergar" o Bean e resolve o erro do Service
public class UserMapper {

    public User toEntity(RegisterRequest dto) {
        if (dto == null) return null;

        User user = new User();
        user.setFullName(dto.fullName());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        return user;
    }

    public UserDTO toUserDTO(User user) {
        if (user == null) return null;

        String roleName = (user.getRole() != null) ? user.getRole().getName() : "UNKNOWN";

        return new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                roleName
        );
    }
}