package org.example.weare8eqd.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Table(name = "msu_users")
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "first_name", nullable = false)
    private String givenName;

    @Column(name = "last_name", nullable = false)
    private String familyName;

    @Column(name = "login", nullable = false, unique = true, updatable = false)
    private String login;

    @Column(name = "password", nullable = false)
    private String password;

    @OneToMany(mappedBy = "taskId")
    @Column(name = "user_tasks", nullable = false)
    private List<Task> tasks;

    @Transient
    @Column(name = "shared_progress")
    private Set<String> friends;
}
