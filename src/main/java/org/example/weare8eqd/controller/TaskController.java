package org.example.weare8eqd.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.weare8eqd.dto.*;
import org.example.weare8eqd.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
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
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<String> createTask(
            @RequestBody @Valid TaskDto taskDto) {

        int id = taskService.createTask(taskDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("task with id=" + id + " successfully created");
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDto> getTask(
            @PathVariable Integer taskId) {

        return ResponseEntity.ok(taskService.getTaskById(taskId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDto>> getTasksByUser(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(taskService.getTasksByUserId(userId));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<String> updateTask(
            @PathVariable Integer taskId,
            @RequestBody @Valid UpdateTaskDto updateTaskDto) {

        taskService.updateTask(taskId, updateTaskDto);
        return ResponseEntity.ok("task with id=" + taskId + " successfully updated");
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(
            @PathVariable Integer taskId) {

        taskService.deleteTask(taskId);
        return ResponseEntity.ok("task with id=" + taskId + " successfully deleted");
    }
}
