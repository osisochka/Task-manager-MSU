package org.example.weare8eqd.service.serviceimpl;

import lombok.RequiredArgsConstructor;
import org.example.weare8eqd.domain.Task;
import org.example.weare8eqd.domain.User;
import org.example.weare8eqd.dto.TaskDto;
import org.example.weare8eqd.dto.UpdateTaskDto;
import org.example.weare8eqd.repository.TaskRepository;
import org.example.weare8eqd.repository.UserRepository;
import org.example.weare8eqd.service.TaskService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    private TaskDto toDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setSubject(task.getSubject());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setTypeOfTask(task.getTypeOfTask());
        dto.setDeadline(toDate(task.getDeadline()));
        dto.setStarted(task.isStarted() ? toDate(task.getDeadline()) : null); // Example logic
        dto.setFinished(task.isFinished() ? toDate(task.getDeadline()) : null); // Example logic
        dto.setUserId(task.getUser().getUserId());
        return dto;
    }

    private Task toEntity(TaskDto dto, User user) {
        return Task.builder()
                .subject(dto.getSubject())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .priority(dto.getPriority())
                .typeOfTask(dto.getTypeOfTask())
                .deadline(toLocalDateTime(dto.getDeadline()))
                .started(dto.getStarted() != null)
                .finished(dto.getFinished() != null)
                .user(user)
                .build();
    }

    private LocalDateTime toLocalDateTime(Date date) {
        return date == null ? null : date.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime();
    }

    private Date toDate(LocalDateTime ldt) {
        return ldt == null ? null : java.util.Date.from(ldt.atZone(java.time.ZoneId.systemDefault()).toInstant());
    }


    @Override
    public TaskDto getTaskById(Integer taskId) {
        return taskRepository.findById(taskId)
                .map(this::toDto)
                .orElse(null);
    }

    @Override
    public boolean createTask(TaskDto request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isEmpty()) return false;
        Task task = toEntity(request, userOpt.get());
        taskRepository.save(task);
        return true;
    }

    @Override
    public boolean updateTask(Integer taskId, TaskDto request) {
//        Optional<Task> taskOpt = taskRepository.findById(taskId);
//        if (taskOpt.isEmpty()) return false;
//        Task task = taskOpt.get();
//        task.setSubject(request.getSubject());
//        task.setTitle(request.getTitle());
//        task.setDescription(request.getDescription());
//        task.setPriority(request.getPriority());
//        task.setTypeOfTask(request.getTypeOfTask());
//        task.setDeadline(toLocalDateTime(request.getDeadline()));
//        task.setStarted(request.getStarted() != null);
//        task.setFinished(request.getFinished() != null);
//        taskRepository.save(task);
        return true;
    }

    @Override
    public List<TaskDto> getTaskByUser(Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return List.of();
        List<Task> tasks = taskRepository.findAllByUser(userOpt.get());
        return tasks.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public boolean deleteTask(Integer taskId) {
        if (!taskRepository.existsById(taskId)) return false;
        taskRepository.deleteById(taskId);
        return true;
    }

    @Override
    public Page<TaskDto> getUserTask(Integer userId, int page, int size) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return Page.empty();
        }
        User user = userOpt.get();

        Page<Task> tasksPage = taskRepository.findAllByUser(user, (Pageable) PageRequest.of(page, size));
        return tasksPage.map(this::toDto);
    }



}
