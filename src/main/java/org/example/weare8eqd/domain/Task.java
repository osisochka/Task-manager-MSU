package org.example.weare8eqd.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Table(name = "tasks")
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id", nullable = false)
    private Integer taskId;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private Priority priority;

    @Column(nullable = false)
    private TypeOfTask typeOfTask;

    private LocalDateTime started;

    private LocalDateTime finished;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
