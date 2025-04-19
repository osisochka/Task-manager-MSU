package org.example.weare8eqd.service;

import org.example.weare8eqd.dto.TaskDto;
import org.example.weare8eqd.dto.UpdateTaskDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface TaskService {

    TaskDto getTaskById(Integer orderId);

    boolean createTask(TaskDto request);

    boolean updateTask(Integer taskId, UpdateTaskDto request);

    List<TaskDto> getTaskByUser(Integer userId);

    boolean deleteTask(Integer taskId);

    Page<TaskDto> getUserTask(Integer userId, int page, int size);
}

