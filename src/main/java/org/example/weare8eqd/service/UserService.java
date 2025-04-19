package org.example.weare8eqd.service;

import org.example.weare8eqd.dto.CreateUserDto;
import org.example.weare8eqd.dto.UpdateUserDto;
import org.example.weare8eqd.dto.UserDto;

import java.util.List;

public interface UserService {

    int addUser(CreateUserDto createUserDto);

    UserDto getUser(Integer userId);

    UserDto getUserByLogin(String login);

    List<UserDto> getAllUsers();

    void updateUser(Integer userId, UpdateUserDto updateUserDto);

    void deleteUser(Integer userId);

}
