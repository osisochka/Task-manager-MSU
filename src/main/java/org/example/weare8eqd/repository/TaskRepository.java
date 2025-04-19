package org.example.weare8eqd.repository;

import org.example.weare8eqd.domain.Task;
import org.example.weare8eqd.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findAllByUser(User user);
    Page<Task> findAllByUser(User user, Pageable pageable);
}
