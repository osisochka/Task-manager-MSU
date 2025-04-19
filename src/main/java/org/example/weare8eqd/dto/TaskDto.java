package org.example.weare8eqd.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.weare8eqd.domain.Priority;
import org.example.weare8eqd.domain.TypeOfTask;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskDto {
    String subject;

    @NotBlank
    String title;
    String description;
    Priority priority;
    TypeOfTask typeOfTask;
    LocalDateTime deadline;
    LocalDateTime started;
    LocalDateTime finished;

    @NotNull
    Integer userId;
}
