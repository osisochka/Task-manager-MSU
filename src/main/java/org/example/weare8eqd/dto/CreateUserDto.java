package org.example.weare8eqd.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserDto {
    @NotBlank
    String givenName;

    @NotBlank
    String familyName;

    @NotBlank
    String login;

    @NotBlank
    String password;
}
