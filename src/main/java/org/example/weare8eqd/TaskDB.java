import org.example.weare8eqd.domain.Task;
import org.example.weare8eqd.domain.Priority;
import org.example.weare8eqd.domain.TypeOfTask;
import org.example.weare8eqd.domain.User;
import org.example.weare8eqd.repository.TaskRepository;
import org.example.weare8eqd.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.List;

@Bean
CommandLineRunner TaskDB(TaskRepository taskRepo, UserRepository userRepo) {
    return args -> {

        User testUser = User.builder()
                .givenName("Иван")
                .familyName("Иванов")
                .login("ivanov")
                .password("securePassword123")
                .build();

        User savedUser = userRepo.save(testUser);

        taskRepo.saveAll(List.of(
                Task.builder()
                        .title("Домашнее задание")
                        .subject("economics")
                        .typeOfTask(TypeOfTask.BIG_HOMEWORK)
                        .deadline(LocalDateTime.parse("2025-04-20T22:00"))
                        .priority(Priority.HIGH)
                        .description("Подготовить презентацию по теме \"Рыночная экономика\"")
                        .user(savedUser)
                        .build(),

                Task.builder()
                        .title("Подготовка")
                        .subject("economics")
                        .typeOfTask(TypeOfTask.PREPARATION)
                        .deadline(LocalDateTime.parse("2025-04-25T10:00"))
                        .priority(Priority.MEDIUM)
                        .description("Подготовка к семинару")
                        .user(savedUser)
                        .build(),

                Task.builder()
                        .title("Лабораторная работа №1")
                        .subject("physics")
                        .typeOfTask(TypeOfTask.PRACTISE)
                        .deadline(LocalDateTime.parse("2025-04-18T15:00"))
                        .priority(Priority.HIGH)
                        .description("Измерение ускорения свободного падения")
                        .user(savedUser)
                        .build(),

                Task.builder()
                        .title("Лабораторная работа №2")
                        .subject("physics")
                        .typeOfTask(TypeOfTask.PRACTISE)
                        .deadline(LocalDateTime.parse("2025-05-25T10:00"))
                        .priority(Priority.MEDIUM)
                        .description("Изучение законов динамики")
                        .user(savedUser)
                        .build(),

                Task.builder()
                        .title("Домашнее задание")
                        .subject("physics")
                        .typeOfTask(TypeOfTask.BIG_HOMEWORK)
                        .deadline(LocalDateTime.parse("2025-04-20T23:59"))
                        .priority(Priority.HIGH)
                        .description("Решение задач по динамике")
                        .user(savedUser)
                        .build(),

                Task.builder()
                        .title("Подготовка")
                        .subject("physics")
                        .typeOfTask(TypeOfTask.HOMEWORK)
                        .deadline(LocalDateTime.parse("2025-04-25T10:00"))
                        .priority(Priority.MEDIUM)
                        .description("Подготовка к контрольной работе")
                        .user(savedUser)
                        .build()
        ));
    };
}

public void main() {
}
