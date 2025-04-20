package org.example.weare8eqd.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AddFriend {

    @NotBlank(message = "login is required")
    String login;
}
