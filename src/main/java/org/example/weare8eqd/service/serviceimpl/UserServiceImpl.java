package org.example.weare8eqd.service.serviceimpl;


import org.example.weare8eqd.domain.Task;
import org.example.weare8eqd.domain.User;
import org.example.weare8eqd.dto.CreateUserDto;
import org.example.weare8eqd.dto.UpdateUserDto;
import org.example.weare8eqd.dto.UserDto;
import org.example.weare8eqd.repository.UserRepository;
import org.example.weare8eqd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean addUser(CreateUserDto createUserDto) {
        if (userRepository.findByLogin(createUserDto.getLogin()) != null) {
            return false;
        }
        User user = User.builder()
                .givenName(createUserDto.getGivenName())
                .familyName(createUserDto.getFamilyName())
                .login(createUserDto.getLogin())
                .password(createUserDto.getPassword())
                .build();
        userRepository.save(user);
        return true;
    }

    @Override
    public UserDto getUser(Long userId) {
        return userRepository.findById(userId.intValue())
                .map(this::toDto)
                .orElse(null);
    }


    @Override
    public UserDto getUserByLogin(String login) {
        User user = userRepository.findByLogin(login);
        return user != null ? toDto(user) : null;
    }


    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    @Override
    public boolean updateUser(Long userId, UpdateUserDto updateUserDto) {
        return userRepository.findById(userId.intValue()).map(user -> {
            user.setGivenName(updateUserDto.getGivenName());
            user.setFamilyName(updateUserDto.getFamilyName());
            // loginы разные у всех
            userRepository.save(user);
            return true;
        }).orElse(false);
    }


    @Override
    public boolean deleteUser(Long userId) {
        if (userRepository.existsById(userId.intValue())) {
            userRepository.deleteById(userId.intValue());
            return true;
        }
        return false;
    }

    private UserDto toDto(User user) {
        List<Integer> taskIds = user.getTasks()
                .stream()
                .map(Task::getTaskId)
                .collect(Collectors.toList());
        return new UserDto(
                user.getGivenName(),
                user.getFamilyName(),
                user.getLogin(),
                user.getFriends(),
                taskIds
        );
    }


}
