package org.example.weare8eqd.service;

import org.example.weare8eqd.dto.TaskDto;
import org.example.weare8eqd.dto.UpdateTaskDto;

import java.util.List;

public interface TaskService {

    TaskDto getTaskById(Integer orderId);

    int createTask(TaskDto request);

    void updateTask(Integer taskId, UpdateTaskDto request);

    List<TaskDto> getTasksByUserId(Integer userId);

    void deleteTask(Integer taskId);
}

