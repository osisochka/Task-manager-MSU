package org.example.weare8eqd.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import org.example.weare8eqd.domain.Priority;
import org.example.weare8eqd.domain.TypeOfTask;

import java.time.LocalDateTime;


@Getter
@Setter
@Builder
public class UpdateTaskDto {
    String subject;
    String title;
    String description;
    Priority priority;
    TypeOfTask typeOfTask;
    LocalDateTime deadline;
    LocalDateTime finished;
}
