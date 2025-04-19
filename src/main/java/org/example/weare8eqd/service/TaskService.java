package org.example.weare8eqd.service;

import org.springframework.data.domain.Page;

import java.util.List;

public interface TaskService {

    TaskResponseDto getTaskById(Long orderId);

    TaskResponseDto createTask(CreateTaskRequestDto request);

    TaskResponseDto updateTask(Long taskId, UpdateTaskDto request);

    List<UserTasksResponseDto> getTaskByUser(Long userId);

    DeleteTaskdDto deleteTask(Long taskId);

}
