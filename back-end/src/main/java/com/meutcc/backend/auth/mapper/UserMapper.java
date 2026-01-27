package com.meutcc.backend.auth.mapper;

import com.meutcc.backend.auth.dto.RegisterRequest;
import com.meutcc.backend.auth.dto.UserResponse;
import com.meutcc.backend.user.User;
import org.springframework.stereotype.Component;

/* assim que a dependencia do Mapper vier oficialmente para o spring, tirarei codigo, por agora, farei a mao mesmo

@Mapper(componentModel = "spring")
public interface UserMapper {
    //classe responsável por converter objetos DTO -> Entity e Entity -> DTO, nesse caso, interface
    User toEntity(RegisterRequest registerRequest);

    UserResponse toResponse(User user);
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

    public UserResponse toResponse(User user) {
        if (user == null) return null;

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail()
        );
    }
}