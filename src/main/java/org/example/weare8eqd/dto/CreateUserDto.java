package org.example.weare8eqd.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreateUserDto {

    @NotBlank(message = "first name is required")
    String givenName;

    @NotBlank(message = "last name is required")
    String familyName;

    @NotBlank(message = "login is required")
    String login;

    @NotBlank(message = "password is required")
    String password;
}
