package org.example.weare8eqd.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import org.example.weare8eqd.domain.Priority;
import org.example.weare8eqd.domain.TypeOfTask;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class TaskDto {

    @NotBlank(message = "subject is required")
    String subject;

    @NotBlank(message = "title is required")
    String title;

    @NotNull(message = "user id is required")
    Integer userId;

    @NotNull(message = "deadline is required")
    LocalDateTime deadline;

    @NotNull(message = "type (HOMEWORK, BIG_HOMEWORK, PRACTICE, PREPARATION) is required")
    TypeOfTask typeOfTask;

    @NotNull(message = "priority (LOW, MEDIUM, HIGH) is required")
    Priority priority;

    String description;

    LocalDateTime started;

    LocalDateTime finished;
}
