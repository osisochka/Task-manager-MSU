package org.example.weare8eqd.service;

import java.util.List;

public interface UserService {

    CreatedDto addUser(CreateUserDto createUserDto);

    UserResponseDto getUser(Long userId);

    UserResponseDto getUserByLogin(String login);

    List<UserResponseDto> getAllUsers();

    UpdatedDto updateUser(Long userId, UpdateUserDto updateUserDto);

    DeletedDto deleteUser(Long userId);

}
