package org.example.weare8eqd.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    @NotBlank
    String givenName;


    @NotBlank
    String familyName;

    @NotBlank
    String login;
    Set<String> friends; // login list
    List<Integer> tasks;
}
