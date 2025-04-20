package org.example.weare8eqd.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.weare8eqd.dto.*;
import org.example.weare8eqd.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "User Manager", description = "API для управления пользователями")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(
        value = "http://localhost:3000",
        origins = "http://localhost:3000",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.PATCH,
                RequestMethod.DELETE
        },
        allowedHeaders = "*"
)
public class UserController {

    private final UserService userService;

    @Operation(summary = "Создать нового пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Пользователь успешно создан"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))),
            @ApiResponse(responseCode = "409", description = "Пользователь уже существует",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class)))
    })
    @PostMapping
    public ResponseEntity<String> createUser(
            @RequestBody @Valid CreateUserDto createUserDto) {

        int id = userService.addUser(createUserDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("user with id=" + id + " successfully created");
    }

    @Operation(summary = "Получить пользователя по ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Пользователь найден",
                    content = @Content(schema = @Schema(implementation = UserDto.class))),
            @ApiResponse(responseCode = "404", description = "Пользователь не найден",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class)))
    })
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUser(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(userService.getUser(userId));
    }

    @Operation(summary = "Получить пользователя по логину")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Пользователь найден",
                    content = @Content(schema = @Schema(implementation = UserDto.class))),
            @ApiResponse(responseCode = "404", description = "Пользователь не найден",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class)))
    })
    @GetMapping("/login/{login}")
    public ResponseEntity<UserDto> getUserByLogin(
            @PathVariable String login) {

        return ResponseEntity.ok(userService.getUserByLogin(login));
    }

    @Operation(summary = "Получить всех пользователей")
    @ApiResponse(responseCode = "200", description = "Список пользователей",
            content = @Content(schema = @Schema(implementation = UserDto.class)))
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {

        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Operation(summary = "Обновить пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Пользователь успешно обновлён"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Пользователь не найден",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class)))
    })
    @PutMapping("/{userId}")
    public ResponseEntity<String> updateUser(
            @PathVariable Integer userId,
            @RequestBody @Valid UpdateUserDto updateUserDto) {

        userService.updateUser(userId, updateUserDto);
        return ResponseEntity.ok("user with id=" + userId + " successfully updated");
    }

    @Operation(summary = "Удалить пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Пользователь успешно удалён"),
            @ApiResponse(responseCode = "404", description = "Пользователь не найден",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class)))
    })
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Integer userId) {

        userService.deleteUser(userId);
        return ResponseEntity.ok("user with id=" + userId + " successfully deleted");
    }

    @Operation(summary = "Поделиться прогрессом с другим пользователем")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Дружба успешно добавлена"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Пользователь не найден",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class)))
    })
    @PostMapping("/share/{userId}")
    public ResponseEntity<String> shareProgress(
            @PathVariable Integer userId,
            @RequestBody @Valid AddFriend login) {

        userService.shareProgress(userId, login);
        return ResponseEntity.ok("user with id=" + userId + " is now friends with user with login=" + login.getLogin());
    }
}
