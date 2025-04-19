package org.example.weare8eqd.service.serviceimpl;


import org.example.weare8eqd.domain.Task;
import org.example.weare8eqd.domain.User;
import org.example.weare8eqd.dto.CreateUserDto;
import org.example.weare8eqd.dto.UpdateUserDto;
import org.example.weare8eqd.dto.UserDto;
import org.example.weare8eqd.repository.UserRepository;
import org.example.weare8eqd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
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
    public UserDto getUser(Integer userId) {
        return userRepository.findById(userId)
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
    public boolean updateUser(Integer userId, UpdateUserDto updateUserDto) {
        return userRepository.findById(userId).map(user -> {
            user.setGivenName(updateUserDto.getGivenName());
            user.setFamilyName(updateUserDto.getFamilyName());
            userRepository.save(user);
            return true;
        }).orElse(false);
    }


    @Override
    public boolean deleteUser(Integer userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
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
