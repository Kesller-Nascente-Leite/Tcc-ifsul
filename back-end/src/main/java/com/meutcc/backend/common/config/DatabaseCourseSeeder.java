package com.meutcc.backend.common.config;

import com.meutcc.backend.content.attachment.Attachment;
import com.meutcc.backend.content.attachment.AttachmentRepository;
import com.meutcc.backend.content.attachment.AttachmentType;
import com.meutcc.backend.content.courses.Course;
import com.meutcc.backend.content.courses.CourseRepository;
import com.meutcc.backend.content.exercise.Exercise;
import com.meutcc.backend.content.exercise.ExerciseRepository;
import com.meutcc.backend.content.lesson.Lesson;
import com.meutcc.backend.content.lesson.LessonRepository;
import com.meutcc.backend.content.module.Module;
import com.meutcc.backend.content.module.ModuleRepository;
import com.meutcc.backend.content.question.Question;
import com.meutcc.backend.content.question.QuestionDisplayMode;
import com.meutcc.backend.content.question.QuestionOption;
import com.meutcc.backend.content.question.QuestionRepository;
import com.meutcc.backend.content.question.QuestionType;
import com.meutcc.backend.content.video.Video;
import com.meutcc.backend.content.video.VideoRepository;
import com.meutcc.backend.content.video.VideoStorageType;
import com.meutcc.backend.teacher.Teacher;
import com.meutcc.backend.teacher.TeacherRepository;
import com.meutcc.backend.user.User;
import com.meutcc.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DatabaseCourseSeeder {

    private static final String COURSE_TITLE = "Banco de Dados e SQL";
    private static final String MODULE_TITLE = "Fundamentos de SQL";

    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final VideoRepository videoRepository;
    private final AttachmentRepository attachmentRepository;
    private final ExerciseRepository exerciseRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;

    @Bean
    @Order(4)
    public CommandLineRunner seedDatabaseCourse() {
        return args -> {
            log.info("Iniciando seed do curso '{}'", COURSE_TITLE);

            Teacher teacher = getTeacher();
            Course course = findOrCreateCourse(teacher);
            Module module = findOrCreateModule(course);

            if (lessonRepository.countByModuleId(module.getId()) > 0) {
                log.info("Modulo '{}' ja possui aulas. Seed ignorada para evitar duplicacao.", MODULE_TITLE);
                return;
            }

            createLessons(module);
            log.info("Seed do curso '{}' concluida.", COURSE_TITLE);
        };
    }

    private Teacher getTeacher() {
        // Prioriza o "Professor Principal"
        User mainTeacher = userRepository.findAll().stream()
                .filter(user -> user.getRole() != null)
                .filter(user -> "TEACHER".equalsIgnoreCase(user.getRole().getName()))
                .filter(user -> "Professor Principal".equalsIgnoreCase(user.getFullName()))
                .findFirst()
                .orElse(null);

        // Se não encontrar o professor principal, pega o primeiro professor
        final User teacherUser = mainTeacher != null ? mainTeacher : userRepository.findAll().stream()
                .filter(user -> user.getRole() != null)
                .filter(user -> "TEACHER".equalsIgnoreCase(user.getRole().getName()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Nenhum usuario TEACHER encontrado."));

        return teacherRepository.findByUser(teacherUser)
                .orElseGet(() -> teacherRepository.save(
                        Teacher.builder()
                                .user(teacherUser)
                                .courses(new ArrayList<>())
                                .build()
                ));
    }

    private Course findOrCreateCourse(Teacher teacher) {
        return courseRepository.findByTeacherId(teacher.getId()).stream()
                .filter(course -> COURSE_TITLE.equalsIgnoreCase(course.getTitle()))
                .findFirst()
                .orElseGet(() -> createCourse(teacher));
    }

    private Course createCourse(Teacher teacher) {
        Course course = Course.builder()
                .title(COURSE_TITLE)
                .description("Aprenda do zero sobre bancos de dados relacionais e a linguagem SQL. Domine consultas, criacao de tabelas e relacionamentos.")
                .published(false)
                .isPrivate(false)
                .teacher(teacher)
                .build();

        return courseRepository.save(course);
    }

    private Module findOrCreateModule(Course course) {
        return moduleRepository.findByCourseId(course.getId()).stream()
                .filter(module -> MODULE_TITLE.equalsIgnoreCase(module.getTitle()))
                .findFirst()
                .orElseGet(() -> createModule(course));
    }

    private Module createModule(Course course) {
        Module module = new Module();
        module.setTitle(MODULE_TITLE);
        module.setDescription("Aprenda os conceitos basicos e fundamentais da linguagem SQL.");
        module.setOrderIndex(1);
        module.setCourse(course);

        return moduleRepository.save(module);
    }

    private void createLessons(Module module) {
        createLesson1(module);
        createLesson2(module);
        createLesson3(module);
        createLesson4(module);
        createLesson5(module);
    }

    private void createLesson1(Module module) {
        Lesson lesson = saveLesson(
                module,
                "Introducao a Bancos de Dados",
                "Entenda o que sao bancos de dados e por que eles sao importantes.",
                1,
                15
        );

        createVideo(lesson, "Introducao a Bancos de Dados", "https://www.youtube.com/watch?v=Ofktsne-utM");
        createAttachment(
                lesson,
                "Slides - Introducao a BD.pdf",
                "Slides da aula sobre conceitos basicos de bancos de dados.",
                "https://drive.google.com/file/d/1ABC123/view"
        );
        createAttachment(
                lesson,
                "Artigo - Historia dos Bancos de Dados",
                "Documento com a evolução histórica dos bancos de dados.",
                "https://drive.google.com/file/d/1XYZ789/view"
        );

        createExercise1(lesson);
    }

    private void createExercise1(Lesson lesson) {
        Exercise exercise = saveExercise(Exercise.builder()
                .title("Quiz - Introdução a Bancos de Dados")
                .description("Teste seus conhecimentos sobre conceitos básicos.")
                .instructions("Responda as questões abaixo. Voce tem 20 minutos.")
                .lesson(lesson)
                .totalPoints(100)
                .passingScore(70)
                .timeLimit(20)
                .maxAttempts(3)
                .shuffleQuestions(true)
                .shuffleOptions(true)
                .showCorrectAnswers(true)
                .showScore(true)
                .allowReview(true)
                .questionDisplayMode(QuestionDisplayMode.ALL_AT_ONCE)
                .isActive(true)
                .order(0)
                .build());

        createQuestion1_1(exercise);
        createQuestion1_2(exercise);
        createQuestion1_3(exercise);
        createQuestion1_4(exercise);
        createQuestion1_5(exercise);
    }

    private void createQuestion1_1(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.MULTIPLE_CHOICE_SINGLE,
                "O que e SQL?",
                "SQL significa Structured Query Language.",
                20,
                0
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Um tipo de banco de dados NoSQL", false, 0));
        options.add(createOption(question, "Uma linguagem de programacao orientada a objetos", false, 1));
        options.add(createOption(question, "Uma linguagem para consultar bancos de dados relacionais", true, 2));
        options.add(createOption(question, "Um sistema gerenciador de banco de dados", false, 3));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion1_2(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.TRUE_FALSE,
                "Bancos de dados NoSQL nao permitem consultas SQL.",
                "Falso. Alguns bancos NoSQL permitem consultas SQL.",
                20,
                1
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Verdadeiro", false, 0));
        options.add(createOption(question, "Falso", true, 1));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion1_3(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.MULTIPLE_CHOICE_SINGLE,
                "Qual e um SGBD relacional?",
                "PostgreSQL e um SGBD relacional.",
                20,
                2
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "MongoDB", false, 0));
        options.add(createOption(question, "Redis", false, 1));
        options.add(createOption(question, "PostgreSQL", true, 2));
        options.add(createOption(question, "Cassandra", false, 3));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion1_4(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.MULTIPLE_CHOICE_MULTIPLE,
                "Quais sao componentes de uma tabela relacional?",
                "Colunas e linhas sao componentes fundamentais.",
                20,
                3
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Colunas", true, 0));
        options.add(createOption(question, "Documentos", false, 1));
        options.add(createOption(question, "Linhas", true, 2));
        options.add(createOption(question, "Grafos", false, 3));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion1_5(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.TRUE_FALSE,
                "Uma tabela pode ter mais de uma chave primaria?",
                "Falso. Uma tabela so pode ter uma chave primaria, que pode ser composta por uma ou mais colunas.",
                20,
                4
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Verdadeiro", false, 0));
        options.add(createOption(question, "Falso", true, 1));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createLesson2(Module module) {
        Lesson lesson = saveLesson(
                module,
                "SELECT - Consultando Dados",
                "Aprenda a fazer consultas em bancos de dados.",
                2,
                20
        );

        createVideo(lesson, "SELECT - Como Consultar Dados", "https://www.youtube.com/watch?v=EXAMPLE2");
        createAttachment(
                lesson,
                "Cheat Sheet - SELECT.pdf",
                "Guia rapido de comandos SELECT.",
                "https://drive.google.com/file/d/2ABC456/view"
        );
        createAttachment(
                lesson,
                "Exemplos SELECT.sql",
                "Arquivo com exemplos praticos.",
                "https://drive.google.com/file/d/2XYZ123/view"
        );

        createExercise2(lesson);
    }

    private void createExercise2(Lesson lesson) {
        Exercise exercise = saveExercise(Exercise.builder()
                .title("Praticando SELECT")
                .description("Teste seus conhecimentos sobre SELECT.")
                .instructions("Responda as questoes. Voce tem 15 minutos.")
                .lesson(lesson)
                .totalPoints(100)
                .passingScore(70)
                .timeLimit(15)
                .maxAttempts(3)
                .shuffleQuestions(true)
                .shuffleOptions(true)
                .showCorrectAnswers(true)
                .showScore(true)
                .allowReview(true)
                .questionDisplayMode(QuestionDisplayMode.ALL_AT_ONCE)
                .isActive(true)
                .order(0)
                .build());

        createQuestion2_1(exercise);
        createQuestion2_2(exercise);
        createQuestion2_3(exercise);
        createQuestion2_4(exercise);
    }

    private void createQuestion2_1(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.MULTIPLE_CHOICE_SINGLE,
                "Qual comando consulta dados de uma tabela?",
                "SELECT e o comando usado para consultar.",
                20,
                0
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "GET", false, 0));
        options.add(createOption(question, "SELECT", true, 1));
        options.add(createOption(question, "QUERY", false, 2));
        options.add(createOption(question, "FETCH", false, 3));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion2_2(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.MULTIPLE_CHOICE_SINGLE,
                "Como selecionar todas as colunas de 'usuarios'?",
                "O asterisco (*) seleciona todas as colunas.",
                20,
                1
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "SELECT ALL FROM usuarios;", false, 0));
        options.add(createOption(question, "SELECT * FROM usuarios;", true, 1));
        options.add(createOption(question, "GET * FROM usuarios;", false, 2));
        options.add(createOption(question, "FETCH ALL usuarios;", false, 3));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion2_3(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.TRUE_FALSE,
                "SELECT nome, email FROM clientes retorna apenas essas colunas.",
                "Verdadeiro. Apenas as colunas especificadas sao retornadas.",
                20,
                2
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Verdadeiro", true, 0));
        options.add(createOption(question, "Falso", false, 1));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion2_4(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.ESSAY,
                "Para que serve ORDER BY? De um exemplo.",
                "ORDER BY ordena os resultados.",
                40,
                3
        );

        saveQuestion(question);
    }

    private void createLesson3(Module module) {
        Lesson lesson = saveLesson(
                module,
                "WHERE - Filtrando Resultados",
                "Aprenda a filtrar dados com WHERE.",
                3,
                25
        );

        createVideo(lesson, "WHERE - Filtrando com Precisao", "https://www.youtube.com/watch?v=EXAMPLE3");
        createAttachment(
                lesson,
                "Guia WHERE.pdf",
                "Guia completo da clausula WHERE.",
                "https://drive.google.com/file/d/3ABC789/view"
        );

        createExercise3(lesson);
    }

    private void createExercise3(Lesson lesson) {
        Exercise exercise = saveExercise(Exercise.builder()
                .title("Dominando WHERE")
                .description("Pratique filtros SQL.")
                .instructions("Complete o quiz. Duracao: 20 minutos.")
                .lesson(lesson)
                .totalPoints(100)
                .passingScore(70)
                .timeLimit(20)
                .maxAttempts(2)
                .shuffleQuestions(true)
                .shuffleOptions(true)
                .showCorrectAnswers(true)
                .showScore(true)
                .allowReview(false)
                .questionDisplayMode(QuestionDisplayMode.ALL_AT_ONCE)
                .isActive(true)
                .order(0)
                .build());

        createQuestion3_1(exercise);
        createQuestion3_2(exercise);
        createQuestion3_3(exercise);
    }

    private void createQuestion3_1(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.MULTIPLE_CHOICE_SINGLE,
                "Qual operador busca padroes?",
                "LIKE e usado para buscar padroes.",
                33,
                0
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "IN", false, 0));
        options.add(createOption(question, "LIKE", true, 1));
        options.add(createOption(question, "CONTAINS", false, 2));
        options.add(createOption(question, "MATCH", false, 3));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion3_2(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.MULTIPLE_CHOICE_MULTIPLE,
                "Quais sao operadores logicos em SQL?",
                "AND, OR e NOT sao operadores logicos.",
                34,
                1
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "AND", true, 0));
        options.add(createOption(question, "ALSO", false, 1));
        options.add(createOption(question, "OR", true, 2));
        options.add(createOption(question, "NOT", true, 3));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion3_3(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.TRUE_FALSE,
                "WHERE preco > 100 AND categoria = 'Eletronicos' retorna produtos eletronicos caros.",
                "Verdadeiro. AND exige ambas as condicoes.",
                33,
                2
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Verdadeiro", true, 0));
        options.add(createOption(question, "Falso", false, 1));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createLesson4(Module module) {
        Lesson lesson = saveLesson(
                module,
                "INSERT, UPDATE, DELETE",
                "Aprenda a manipular dados.",
                4,
                30
        );

        createVideo(lesson, "Manipulando Dados - DML", "https://www.youtube.com/watch?v=EXAMPLE4");
        createAttachment(
                lesson,
                "Slides DML.pdf",
                "Comandos de manipulacao de dados.",
                "https://drive.google.com/file/d/4ABC321/view"
        );

        createExercise4(lesson);
    }

    private void createExercise4(Lesson lesson) {
        Exercise exercise = saveExercise(Exercise.builder()
                .title("DML na Pratica")
                .description("Teste manipulacao de dados.")
                .instructions("Responda sobre INSERT, UPDATE e DELETE.")
                .lesson(lesson)
                .totalPoints(100)
                .passingScore(70)
                .timeLimit(25)
                .maxAttempts(3)
                .shuffleQuestions(false)
                .shuffleOptions(true)
                .showCorrectAnswers(false)
                .showScore(true)
                .allowReview(true)
                .questionDisplayMode(QuestionDisplayMode.ALL_AT_ONCE)
                .isActive(true)
                .order(0)
                .build());

        createQuestion4_1(exercise);
        createQuestion4_2(exercise);
        createQuestion4_3(exercise);
    }

    private void createQuestion4_1(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.MULTIPLE_CHOICE_SINGLE,
                "Comando para adicionar registro?",
                "INSERT INTO adiciona registros.",
                30,
                0
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "ADD", false, 0));
        options.add(createOption(question, "INSERT INTO", true, 1));
        options.add(createOption(question, "CREATE", false, 2));
        options.add(createOption(question, "NEW", false, 3));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion4_2(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.MULTIPLE_CHOICE_SINGLE,
                "Comando para atualizar registros?",
                "UPDATE modifica registros.",
                30,
                1
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "MODIFY", false, 0));
        options.add(createOption(question, "CHANGE", false, 1));
        options.add(createOption(question, "UPDATE", true, 2));
        options.add(createOption(question, "EDIT", false, 3));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion4_3(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.TRUE_FALSE,
                "E importante sempre usar WHERE em UPDATE e DELETE.",
                "Verdadeiro. Sem WHERE, afeta todos os registros.",
                40,
                2
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Verdadeiro", true, 0));
        options.add(createOption(question, "Falso", false, 1));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createLesson5(Module module) {
        Lesson lesson = saveLesson(
                module,
                "JOINs - Relacionamentos",
                "Combine dados de multiplas tabelas.",
                5,
                35
        );

        createVideo(lesson, "Entendendo JOINs", "https://www.youtube.com/watch?v=EXAMPLE5");
        createVideo(lesson, "JOINs na Pratica", "https://www.youtube.com/watch?v=EXAMPLE5B");
        createAttachment(
                lesson,
                "Infografico JOINs.pdf",
                "Visual dos tipos de JOINs.",
                "https://drive.google.com/file/d/5ABC987/view"
        );

        createExercise5(lesson);
    }

    private void createExercise5(Lesson lesson) {
        Exercise exercise = saveExercise(Exercise.builder()
                .title("Desafio JOINs")
                .description("Teste dominio sobre JOINs.")
                .instructions("Exercicio avancado. Tempo: 30 minutos.")
                .lesson(lesson)
                .totalPoints(150)
                .passingScore(75)
                .timeLimit(30)
                .maxAttempts(2)
                .shuffleQuestions(false)
                .shuffleOptions(true)
                .showCorrectAnswers(true)
                .showScore(true)
                .allowReview(true)
                .questionDisplayMode(QuestionDisplayMode.ALL_AT_ONCE)
                .isActive(true)
                .order(0)
                .availableFrom(LocalDateTime.now())
                .availableUntil(LocalDateTime.now().plusDays(30))
                .build());

        createQuestion5_1(exercise);
        createQuestion5_2(exercise);
        createQuestion5_3(exercise);
        createQuestion5_4(exercise);
    }

    private void createQuestion5_1(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.MULTIPLE_CHOICE_SINGLE,
                "JOIN que retorna apenas registros em ambas as tabelas?",
                "INNER JOIN retorna apenas correspondencias.",
                30,
                0
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "LEFT JOIN", false, 0));
        options.add(createOption(question, "RIGHT JOIN", false, 1));
        options.add(createOption(question, "INNER JOIN", true, 2));
        options.add(createOption(question, "FULL OUTER JOIN", false, 3));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion5_2(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.MULTIPLE_CHOICE_SINGLE,
                "JOIN que retorna todos da esquerda?",
                "LEFT JOIN retorna todos da esquerda.",
                30,
                1
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "LEFT JOIN", true, 0));
        options.add(createOption(question, "RIGHT JOIN", false, 1));
        options.add(createOption(question, "INNER JOIN", false, 2));
        options.add(createOption(question, "CROSS JOIN", false, 3));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion5_3(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.TRUE_FALSE,
                "RIGHT JOIN equivale a LEFT JOIN trocando a ordem?",
                "Verdadeiro. A RIGHT JOIN B equivale a B LEFT JOIN A.",
                30,
                2
        );

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Verdadeiro", true, 0));
        options.add(createOption(question, "Falso", false, 1));
        question.setOptions(options);

        saveQuestion(question);
    }

    private void createQuestion5_4(Exercise exercise) {
        Question question = baseQuestion(
                exercise,
                QuestionType.ESSAY,
                "Explique a diferenca entre INNER JOIN e LEFT JOIN com exemplos.",
                "INNER retorna apenas combinacoes existentes. LEFT preserva todos os registros da esquerda.",
                60,
                3
        );

        saveQuestion(question);
    }

    private Lesson saveLesson(Module module, String title, String description, int orderIndex, int durationMinutes) {
        Lesson lesson = Lesson.builder()
                .title(title)
                .description(description)
                .orderIndex(orderIndex)
                .durationMinutes(durationMinutes)
                .module(module)
                .build();

        return lessonRepository.save(lesson);
    }

    private Exercise saveExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    private Question baseQuestion(
            Exercise exercise,
            QuestionType type,
            String questionText,
            String explanation,
            int points,
            int order
    ) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(type)
                .questionText(questionText)
                .explanation(explanation)
                .points(points)
                .order(order)
                .isRequired(true)
                .build();

        question.setOptions(new ArrayList<>());
        question.setAnswers(new ArrayList<>());
        return question;
    }

    private void saveQuestion(Question question) {
        if (question.getOptions() == null) {
            question.setOptions(new ArrayList<>());
        }
        if (question.getAnswers() == null) {
            question.setAnswers(new ArrayList<>());
        }

        questionRepository.save(question);
    }

    private void createVideo(Lesson lesson, String title, String url) {
        Video video = Video.builder()
                .title(title)
                .url(url)
                .storageType(VideoStorageType.URL)
                .lesson(lesson)
                .build();

        videoRepository.save(video);
    }

    private void createAttachment(
            Lesson lesson,
            String title,
            String description,
            String fileUrl
    ) {
        Attachment attachment = Attachment.builder()
                .title(title)
                .description(description)
                .fileName(title)
                .fileUrl(fileUrl)
                .type(AttachmentType.LINK)
                .lesson(lesson)
                .build();

        attachmentRepository.save(attachment);
    }

    private QuestionOption createOption(Question question, String text, boolean isCorrect, int orderIndex) {
        return QuestionOption.builder()
                .question(question)
                .optionText(text)
                .isCorrect(isCorrect)
                .order(orderIndex)
                .build();
    }
}
