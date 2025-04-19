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
public class UserDto {
    @NotBlank
    String givenName;

    @NotBlank
    String familyName;

    @NotBlank
    String login;
    String[] friends; // login list
    Integer[] activeTasks; // id of tasks
    Integer[] finishedTasks;
}
