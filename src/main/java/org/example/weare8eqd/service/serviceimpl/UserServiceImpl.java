package org.example.weare8eqd.service.serviceimpl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.weare8eqd.domain.User;
import org.example.weare8eqd.dto.*;
import org.example.weare8eqd.repository.UserRepository;
import org.example.weare8eqd.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public int addUser(CreateUserDto createUserDto) {

        if (userRepository.existsByLogin(createUserDto.getLogin())) {
            throw new ItemAlreadyExistsException("user with login=" + createUserDto.getLogin() + " already exists");
        }

        User user = userRepository.save(
                User.builder()
                        .givenName(createUserDto.getGivenName())
                        .familyName(createUserDto.getFamilyName())
                        .login(createUserDto.getLogin())
                        .password(createUserDto.getPassword())
                        .build()
        );

        return user.getUserId();
    }

    @Override
    public UserDto getUser(Integer userId) {

        User user = userRepository.findById(userId).orElseThrow(
                () -> new ItemNotFoundException("user with id=" + userId + " not found")
        );

        return toDto(user);
    }

    @Override
    public UserDto getUserByLogin(String login) {

        User user = userRepository.findByLogin(login).orElseThrow(
                () -> new ItemNotFoundException("user with login=" + login + " not found")
        );

        return toDto(user);
    }

    @Override
    public List<UserDto> getAllUsers() {

        return userRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional
    public void updateUser(Integer userId, UpdateUserDto updateUserDto) {

        User user = userRepository.findById(userId).orElseThrow(
                () -> new ItemNotFoundException("user with id=" + userId + " not found")
        );

        // idk how to do it better
        if (updateUserDto.getGivenName() != null) user.setGivenName(updateUserDto.getGivenName());
        if (updateUserDto.getFamilyName() != null) user.setFamilyName(updateUserDto.getFamilyName());
        if (updateUserDto.getLogin() != null) user.setLogin(updateUserDto.getLogin());

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Integer userId) {

        if (userRepository.existsById(userId)) userRepository.deleteById(userId);
        else throw new ItemNotFoundException("user with id=" + userId + " not found");
    }

    private UserDto toDto(User user) {

        if (user == null) return null;

        return UserDto.builder()
                .givenName(user.getGivenName())
                .familyName(user.getFamilyName())
                .login(user.getLogin())
                .friends(user.getFriends())
                .tasks(
                        user.getTasks().stream().map(
                                task -> TaskDto.builder()
                                        .subject(task.getSubject())
                                        .title(task.getTitle())
                                        .userId(task.getUser().getUserId())
                                        .description(task.getDescription())
                                        .priority(task.getPriority())
                                        .typeOfTask(task.getTypeOfTask())
                                        .deadline(task.getDeadline())
                                        .started(task.getStarted())
                                        .finished(task.getFinished())
                                        .build()
                        ).toList()
                )
                .build();
    }
}
