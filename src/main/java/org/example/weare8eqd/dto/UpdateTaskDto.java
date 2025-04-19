package org.example.weare8eqd.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.weare8eqd.domain.Priority;
import org.example.weare8eqd.domain.TypeOfTask;

import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTaskDto {
    String subject;
    String title;
    String description;
    Priority priority;
    TypeOfTask typeOfTask;
    LocalDateTime deadline;
    LocalDateTime started;
    LocalDateTime finished;
    Integer userId;
}
