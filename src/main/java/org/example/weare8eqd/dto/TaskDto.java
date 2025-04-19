package org.example.weare8eqd.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskDto {
    String title;
    String description;
    Date deadline;
    Date started;
    Date finished;
}
