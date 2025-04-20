package org.example.weare8eqd.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
public class UserDto {

    @NotBlank(message = "givenName is required")
    String givenName;

    @NotBlank(message = "familyName is required")
    String familyName;

    @NotBlank(message = "login is required")
    String login;

    Set<String> friends; // login list

    List<TaskDto> tasks;
}
