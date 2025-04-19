package org.example.weare8eqd.service.serviceimpl;


import org.example.weare8eqd.dto.CreateUserDto;
import org.example.weare8eqd.dto.UpdateUserDto;
import org.example.weare8eqd.dto.UserDto;
import org.example.weare8eqd.service.UserService;

import java.util.List;

public class UserServiceImpl implements UserService {

    @Override
    public boolean addUser(CreateUserDto createUserDto) {
        return false;
    }

    @Override
    public UserDto getUser(Long userId) {
        return null;
    }

    @Override
    public UserDto getUserByLogin(String login) {
        return null;
    }

    @Override
    public List<UserDto> getAllUsers() {
        return List.of();
    }

    @Override
    public boolean updateUser(Long userId, UpdateUserDto updateUserDto) {
        return false;
    }

    @Override
    public boolean deleteUser(Long userId) {
        return false;
    }
}
