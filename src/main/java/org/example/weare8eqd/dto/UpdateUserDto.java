package org.example.weare8eqd.dto;


import lombok.Getter;
import lombok.Setter;
import lombok.Builder;

@Getter
@Setter
@Builder
public class UpdateUserDto {
    String givenName;
    String familyName;
    String login;
}
