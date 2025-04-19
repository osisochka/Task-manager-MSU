package org.example.weare8eqd.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.weare8eqd.domain.Priority;
import org.example.weare8eqd.domain.TypeOfTask;

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
    Date deadline;
    Date started;
    Date finished;

    @NotBlank
    Integer userId;
}
