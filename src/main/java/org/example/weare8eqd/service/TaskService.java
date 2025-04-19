package org.example.weare8eqd.service;

import org.example.weare8eqd.domain.Task;
import org.example.weare8eqd.dto.TaskDto;

import java.util.Date;

public class TaskService {
    public void addTask(TaskDto taskDto) {
        String title = taskDto.getTitle();
        String description = taskDto.getDescription();
        Date deadline = taskDto.getDeadline();
        Date started = taskDto.getStarted();
        Date finished = taskDto.getFinished();
        long id = 1;
        Task newTask = new Task(id, title, description, deadline, started, finished);
    }
}
