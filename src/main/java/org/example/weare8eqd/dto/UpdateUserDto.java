package org.example.weare8eqd.dto;


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
public class UpdateUserDto {
    String givenName;
    String familyName;
    String login;
    Set<String> friends; // login list
    List<Integer> tasks;
}
