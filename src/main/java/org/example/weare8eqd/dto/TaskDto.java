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

    String subject;

    @NotBlank(message = "title is required")
    String title;

    @NotNull(message = "user id is required")
    Integer userId;

    String description;

    Priority priority;

    TypeOfTask typeOfTask;

    LocalDateTime deadline;

    LocalDateTime started;

    LocalDateTime finished;
}
