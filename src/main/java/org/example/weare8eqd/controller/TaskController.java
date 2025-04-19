package org.example.weare8eqd.controller;

import jakarta.validation.Valid;
import org.example.weare8eqd.dto.*;
import org.example.weare8eqd.service.TaskService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public HttpStatus createTask(
            @RequestBody @Valid TaskDto taskDto) {
        if (taskService.createTask(taskDto)) {
            return HttpStatus.CREATED;
        }
        return HttpStatus.CONFLICT;
    }


    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDto> getTask(
            @PathVariable Integer taskId) {
        TaskDto task = taskService.getTaskById(taskId);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDto>> getTasksByUser(
            @PathVariable Integer userId) {
        List<TaskDto> tasks = taskService.getTaskByUser(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/{userId}/paged")
    public ResponseEntity<Page<TaskDto>> getTasksByUserPaged(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<TaskDto> tasks = taskService.getUserTask(userId, page, size);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{taskId}")
    public HttpStatus updateTask(
            @PathVariable Integer taskId,
            @RequestBody @Valid UpdateTaskDto updateTaskDto) {
        if (taskService.updateTask(taskId, updateTaskDto)) {
            return HttpStatus.OK;
        }
        return HttpStatus.CONFLICT;
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Integer taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}