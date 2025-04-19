package org.example.weare8eqd.service;

import lombok.RequiredArgsConstructor;
import org.example.weare8eqd.domain.User;
import org.example.weare8eqd.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> updateUser(Integer id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setGivenName(updatedUser.getGivenName());
            user.setFamilyName(updatedUser.getFamilyName());
            user.setPassword(updatedUser.getPassword());
            return userRepository.save(user);
        });
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }
}
