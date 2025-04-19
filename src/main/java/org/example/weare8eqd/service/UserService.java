package org.example.weare8eqd.service;

import org.example.weare8eqd.domain.User;
import org.example.weare8eqd.dto.UserDto;

public class UserService {
    public void addUser(UserDto userDTO) {
        String givenName = userDTO.getGivenName();
        String familyName = userDTO.getFamilyName();
        String middleName = userDTO.getMiddleName();
        String login = userDTO.getLogin();
        String[] friends = userDTO.getFriends();
        int[] activeTasks = userDTO.getActiveTasks();
        int[] finishedTasks = userDTO.getFinishedTasks();
        long id = 1;
        User newUser = new User(id, givenName, familyName, middleName, login, friends, activeTasks, finishedTasks);
    }
}

