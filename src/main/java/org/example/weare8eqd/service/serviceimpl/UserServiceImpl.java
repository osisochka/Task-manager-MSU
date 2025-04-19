package org.example.weare8eqd.service.serviceimpl;

import java.util.List;

public interface UserServiceImpl {

    CreatedDto addUser(CreateUserDto createUserDto);

    UserResponseDto getUser(Long userId);

    UserResponseDto getUserByLogin(String login);

    List<UserResponseDto> getAllUsers();

    UpdatedDto updateUser(Long userId, UpdateUserDto updateUserDto);

    DeletedDto deleteUser(Long userId);

}
