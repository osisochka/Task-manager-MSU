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
import org.example.weare8eqd.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Tasks Management", description = "API для управления задачами")
@RestController
@RequestMapping("/api/tasks")
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
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Создать новую задачу")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Задача успешно создана"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))),
            @ApiResponse(responseCode = "409", description = "Задача уже существует",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class)))
    })
    @PostMapping
    public ResponseEntity<String> createTask(
            @RequestBody @Valid TaskDto taskDto) {

        int id = taskService.createTask(taskDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("task with id=" + id + " successfully created");
    }

    @Operation(summary = "Получить задачу по ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Задача найдена",
                    content = @Content(schema = @Schema(implementation = TaskDto.class))),
            @ApiResponse(responseCode = "404", description = "Задача не найдена",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class)))
    })
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDto> getTask(
            @PathVariable Integer taskId) {

        return ResponseEntity.ok(taskService.getTaskById(taskId));
    }

    @Operation(summary = "Получить задачи пользователя")
    @ApiResponse(responseCode = "200", description = "Список задач пользователя",
            content = @Content(schema = @Schema(implementation = TaskDto.class)))
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDto>> getTasksByUser(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(taskService.getTasksByUserId(userId));
    }

    @Operation(summary = "Обновить задачу")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Задача успешно обновлена"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Задача не найдена",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class)))
    })
    @PutMapping("/{taskId}")
    public ResponseEntity<String> updateTask(
            @PathVariable Integer taskId,
            @RequestBody @Valid UpdateTaskDto updateTaskDto) {

        taskService.updateTask(taskId, updateTaskDto);
        return ResponseEntity.ok("task with id=" + taskId + " successfully updated");
    }

    @Operation(summary = "Удалить задачу")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Задача успешно удалена"),
            @ApiResponse(responseCode = "404", description = "Задача не найдена",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class)))
    })
    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(
            @PathVariable Integer taskId) {

        taskService.deleteTask(taskId);
        return ResponseEntity.ok("task with id=" + taskId + " successfully deleted");
    }
}
