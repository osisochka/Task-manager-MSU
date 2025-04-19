package org.example.weare8eqd.controller;

import jakarta.validation.Valid;
import org.example.weare8eqd.dto.*;
import org.example.weare8eqd.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Void> createUser(
            @RequestBody @Valid CreateUserDto createUserDto) {
        boolean created = userService.addUser(createUserDto);
        return created
                ? ResponseEntity.status(HttpStatus.CREATED).build()
                : ResponseEntity.badRequest().build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUser(
            @PathVariable Long userId) {
        UserDto user = userService.getUser(userId);
        return user != null
                ? ResponseEntity.ok(user)
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/login/{login}")
    public ResponseEntity<UserDto> getUserByLogin(
            @PathVariable String login) {
        UserDto user = userService.getUserByLogin(login);
        return user != null
                ? ResponseEntity.ok(user)
                : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Void> updateUser(
            @PathVariable Long userId,
            @RequestBody @Valid UpdateUserDto updateUserDto) {
        boolean updated = userService.updateUser(userId, updateUserDto);
        return updated
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long userId) {
        boolean deleted = userService.deleteUser(userId);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}