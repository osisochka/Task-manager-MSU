package org.example.weare8eqd.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserDto {
    String givenName;
    String familyName;
    String login;
    String[] friends; // login list
    Integer[] activeTasks; // id of tasks
    Integer[] finishedTasks;
}
