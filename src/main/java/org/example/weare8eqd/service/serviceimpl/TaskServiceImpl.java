package org.example.weare8eqd.service.serviceimpl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.weare8eqd.domain.Task;
import org.example.weare8eqd.domain.User;
import org.example.weare8eqd.dto.CantCreateTaskException;
import org.example.weare8eqd.dto.ItemNotFoundException;
import org.example.weare8eqd.dto.TaskDto;
import org.example.weare8eqd.dto.UpdateTaskDto;
import org.example.weare8eqd.repository.TaskRepository;
import org.example.weare8eqd.repository.UserRepository;
import org.example.weare8eqd.service.TaskService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public int createTask(TaskDto request) {

        User user = userRepository.findById(request.getUserId()).orElseThrow(
                () -> new CantCreateTaskException("user with id=" + request.getUserId() + " not found")
        );

        Task task = taskRepository.save(toEntity(request, user));

        return task.getTaskId();
    }

    @Override
    public TaskDto getTaskById(Integer taskId) {

        Task task = taskRepository.findById(taskId).orElseThrow(
                () -> new ItemNotFoundException("task with id=" + taskId + " not found")
        );

        return toDto(task);
    }

    @Override
    public List<TaskDto> getTasksByUserId(Integer userId) {

        User user = userRepository.findById(userId).orElseThrow(
                () -> new ItemNotFoundException("user with id=" + userId + " not found")
        );

        return taskRepository.findAllByUser(user).stream().map(this::toDto).toList();
    }

    @Override
    @Transactional
    public void updateTask(Integer taskId, UpdateTaskDto request) {

        Task task = taskRepository.findById(taskId).orElseThrow(
                () -> new ItemNotFoundException("task with id=" + taskId + " not found")
        );

        if (request.getSubject() != null) task.setSubject(request.getSubject());
        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getTypeOfTask() != null) task.setTypeOfTask(request.getTypeOfTask());
        if (request.getDeadline() != null) task.setDeadline(request.getDeadline());
        if (request.getFinished() != null) task.setFinished(request.getFinished());

        taskRepository.save(task);
    }

    @Override
    @Transactional
    public void deleteTask(Integer taskId) {

        if (taskRepository.existsById(taskId)) taskRepository.deleteById(taskId);
        else throw new ItemNotFoundException("task with id=" + taskId + " not found");
    }

    private TaskDto toDto(Task task) {

        if (task == null) return null;

        return TaskDto.builder()
                .subject(task.getSubject())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .typeOfTask(task.getTypeOfTask())
                .deadline(task.getDeadline())
                .started(task.getStarted())
                .finished(task.getFinished())
                .userId(task.getUser().getUserId())
                .build();
    }

    private Task toEntity(TaskDto dto, User user) {
        return Task.builder()
                .subject(dto.getSubject())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .priority(dto.getPriority())
                .typeOfTask(dto.getTypeOfTask())
                .deadline(dto.getDeadline())
                .started(dto.getStarted())
                .finished(dto.getFinished())
                .user(user)
                .build();
    }
}
