package org.example.weare8eqd.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.weare8eqd.dto.*;
import org.example.weare8eqd.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {
                "http://localhost:3000"
        },
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE
        }
)
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<String> createUser(
            @RequestBody @Valid CreateUserDto createUserDto) {

        int id = userService.addUser(createUserDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("user with id=" + id + " successfully created");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUser(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(userService.getUser(userId));
    }

    @GetMapping("/login/{login}")
    public ResponseEntity<UserDto> getUserByLogin(
            @PathVariable String login) {

        return ResponseEntity.ok(userService.getUserByLogin(login));
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {

        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<String> updateUser(
            @PathVariable Integer userId,
            @RequestBody @Valid UpdateUserDto updateUserDto) {

        userService.updateUser(userId, updateUserDto);
        return ResponseEntity.ok("user with id=" + userId + " successfully updated");
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Integer userId) {

        userService.deleteUser(userId);
        return ResponseEntity.ok("user with id=" + userId + " successfully deleted");
    }

    @PostMapping("/share/{userId}")
    public ResponseEntity<String> shareProgress(
            @PathVariable Integer userId,
            @RequestBody @Valid AddFriend login) {

        userService.shareProgress(userId, login);
        return ResponseEntity.ok("user with id=" + userId + " is now friends with user with login=" + login.getLogin());
    }
}
