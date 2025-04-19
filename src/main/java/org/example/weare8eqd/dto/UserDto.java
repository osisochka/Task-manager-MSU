package org.example.weare8eqd.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    String givenName;
    String familyName;
    String middleName;
    String login;
    String[] friends; // login list
    int[] activeTasks; // id of tasks
    int[] finishedTasks;
}
