package org.example.weare8eqd.service;

import lombok.RequiredArgsConstructor;
import org.example.weare8eqd.domain.Task;
import org.example.weare8eqd.domain.User;
import org.example.weare8eqd.dto.TaskDto;
import org.example.weare8eqd.repository.TaskRepository;
import org.example.weare8eqd.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<TaskDto> getTaskById(Integer id) {
        return taskRepository.findById(id).map(this::toDto);
    }

    @Transactional
    public TaskDto createTask(TaskDto taskDto, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Task task = Task.builder()
                .title(taskDto.getTitle())
                .description(taskDto.getDescription())
                .deadline(toLocalDateTime(taskDto.getDeadline()))
                .started(taskDto.getStarted() != null)
                .finished(taskDto.getFinished() != null)
                .user(user)
                .build();

        Task savedTask = taskRepository.save(task);
        return toDto(savedTask);
    }

    @Transactional
    public void deleteTask(Integer id) {
        taskRepository.deleteById(id);
    }


    private TaskDto toDto(Task task) {
        return new TaskDto(
                task.getTitle(),
                task.getDescription(),
                toDate(task.getDeadline()),
                task.isStarted() ? toDate(task.getDeadline()) : null,
                task.isFinished() ? toDate(task.getDeadline()) : null
        );
    }

    @Transactional
    public TaskDto updateTask(Integer id, TaskDto taskDto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDeadline(toLocalDateTime(taskDto.getDeadline()));
        task.setStarted(taskDto.getStarted() != null);
        task.setFinished(taskDto.getFinished() != null);

        return toDto(taskRepository.save(task));
    }

    private LocalDateTime toLocalDateTime(java.util.Date date) {
        if (date == null) return null;
        return date.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime();
    }

    private java.util.Date toDate(LocalDateTime ldt) {
        if (ldt == null) return null;
        return java.util.Date.from(ldt.atZone(java.time.ZoneId.systemDefault()).toInstant());
    }
}
