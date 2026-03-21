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
import com.meutcc.backend.content.question.*;
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
            if (lessonRepository.findById(5L).isPresent()) {
                return;
            }
            log.info("🌱 Iniciando seed do curso de Banco de Dados e SQL...");

            // 1. Buscar teacher
            Teacher teacher = getTeacher();

            // 2. Criar curso
            Course course = courseRepository.findById(5L)
                    .orElseThrow(() -> new RuntimeException("Curso não encontrado"));

            // 3. Criar módulo
            Module module = createModule(course);

            // 4. Criar lessons
            createLessons(module);

            log.info("✅ Seed do curso de Banco de Dados e SQL concluído com sucesso!");
        };
    }

    private Teacher getTeacher() {
        // Buscar um usuário com role TEACHER
        User userWithTeacherRole = userRepository.findAll().stream()
                .filter(u -> u.getRole().getName().equals("TEACHER"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Nenhum usuário TEACHER encontrado!"));

        // Buscar ou criar Teacher
        return teacherRepository.findByUser(userWithTeacherRole)
                .orElseGet(() -> {
                    Teacher newTeacher = Teacher.builder()
                            .user(userWithTeacherRole)
                            .courses(new ArrayList<>())
                            .build();
                    return teacherRepository.save(newTeacher);
                });
    }

    private Course createCourse(Teacher teacher) {
        log.info("📚 Criando curso: Banco de Dados e SQL");

        Course course = Course.builder()
                .title("Banco de Dados e SQL")
                .description("Aprenda do zero sobre bancos de dados relacionais e a linguagem SQL. " +
                        "Domine consultas, criação de tabelas, relacionamentos e muito mais.")
                .teacher(teacher)
                .build();

        return courseRepository.save(course);
    }

    private Module createModule(Course course) {
        log.info("📦 Criando módulo: Fundamentos de SQL");

        Module module = new Module();
        module.setTitle("Fundamentos de SQL");
        module.setDescription("Aprenda os conceitos básicos e fundamentais da linguagem SQL");
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

    // ==================== AULA 1 ====================
    private void createLesson1(Module module) {
        log.info("📖 Criando Aula 1: Introdução a Bancos de Dados");

        Lesson lesson = Lesson.builder()
                .title("Introdução a Bancos de Dados")
                .description("Entenda o que são bancos de dados e por que eles são importantes")
                .orderIndex(1)
                .durationMinutes(15)
                .module(module)
                .build();

        lesson = lessonRepository.save(lesson);

        // Vídeo
        createVideo(lesson, "Introdução a Bancos de Dados",
                "https://www.youtube.com/watch?v=Ofktsne-utM");

        // Anexos
        createAttachment(lesson, "Slides - Introdução a BD.pdf",
                "Slides da aula sobre conceitos básicos de bancos de dados",
                "https://drive.google.com/file/d/1ABC123/view", AttachmentType.LINK);

        createAttachment(lesson, "Artigo - História dos Bancos de Dados",
                "Documento com a evolução histórica dos bancos de dados",
                "https://drive.google.com/file/d/1XYZ789/view", AttachmentType.LINK);

        // Exercício
        createExercise1(lesson);
    }

    private void createExercise1(Lesson lesson) {
        log.info("   📝 Criando exercício: Quiz - Introdução a BD");

        Exercise exercise = Exercise.builder()
                .title("Quiz - Introdução a Bancos de Dados")
                .description("Teste seus conhecimentos sobre conceitos básicos")
                .instructions("Responda às questões abaixo. Você tem 20 minutos.")
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
                .build();

        exercise = exerciseRepository.save(exercise);

        createQuestion1_1(exercise);
        createQuestion1_2(exercise);
        createQuestion1_3(exercise);
        createQuestion1_4(exercise);
    }

    private void createQuestion1_1(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.MULTIPLE_CHOICE_SINGLE)
                .questionText("O que é SQL?")
                .points(25)
                .explanation("SQL significa Structured Query Language")
                .order(0)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Um tipo de banco de dados NoSQL", false, 0));
        options.add(createOption(question, "Uma linguagem de programação orientada a objetos", false, 1));
        options.add(createOption(question, "Uma linguagem para consultar bancos de dados relacionais", true, 2));
        options.add(createOption(question, "Um sistema gerenciador de banco de dados", false, 3));

        question.setOptions(options);
        questionRepository.save(question);
    }

    private void createQuestion1_2(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.TRUE_FALSE)
                .questionText("Bancos de dados NoSQL não permitem consultas SQL.")
                .points(25)
                .explanation("Falso. Alguns bancos NoSQL permitem consultas SQL.")
                .order(1)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Verdadeiro", false, 0));
        options.add(createOption(question, "Falso", true, 1));

        question.setOptions(options);
        questionRepository.save(question);
    }

    private void createQuestion1_3(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.MULTIPLE_CHOICE_SINGLE)
                .questionText("Qual é um SGBD relacional?")
                .points(25)
                .explanation("PostgreSQL é um SGBD relacional.")
                .order(2)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "MongoDB", false, 0));
        options.add(createOption(question, "Redis", false, 1));
        options.add(createOption(question, "PostgreSQL", true, 2));
        options.add(createOption(question, "Cassandra", false, 3));

        question.setOptions(options);
        questionRepository.save(question);
    }

    private void createQuestion1_4(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.MULTIPLE_CHOICE_MULTIPLE)
                .questionText("Quais são componentes de uma tabela relacional?")
                .points(25)
                .explanation("Colunas e Linhas são componentes fundamentais.")
                .order(3)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Colunas", true, 0));
        options.add(createOption(question, "Documentos", false, 1));
        options.add(createOption(question, "Linhas", true, 2));
        options.add(createOption(question, "Grafos", false, 3));

        question.setOptions(options);
        questionRepository.save(question);
    }

    // ==================== AULA 2 ====================
    private void createLesson2(Module module) {
        log.info("📖 Criando Aula 2: SELECT - Consultando Dados");

        Lesson lesson = Lesson.builder()
                .title("SELECT - Consultando Dados")
                .description("Aprenda a fazer consultas em bancos de dados")
                .orderIndex(2)
                .durationMinutes(20)
                .module(module)
                .build();

        lesson = lessonRepository.save(lesson);

        createVideo(lesson, "SELECT - Como Consultar Dados",
                "https://www.youtube.com/watch?v=EXAMPLE2");

        createAttachment(lesson, "Cheat Sheet - SELECT.pdf",
                "Guia rápido de comandos SELECT",
                "https://drive.google.com/file/d/2ABC456/view", AttachmentType.FILE);

        createAttachment(lesson, "Exemplos SELECT.sql",
                "Arquivo com exemplos práticos",
                "https://drive.google.com/file/d/2XYZ123/view", AttachmentType.LINK);

        createExercise2(lesson);
    }

    private void createExercise2(Lesson lesson) {
        log.info("   📝 Criando exercício: Praticando SELECT");

        Exercise exercise = Exercise.builder()
                .title("Praticando SELECT")
                .description("Teste seus conhecimentos sobre SELECT")
                .instructions("Responda às questões. Você tem 15 minutos.")
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
                .build();

        exercise = exerciseRepository.save(exercise);

        createQuestion2_1(exercise);
        createQuestion2_2(exercise);
        createQuestion2_3(exercise);
        createQuestion2_4(exercise);
    }

    private void createQuestion2_1(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.MULTIPLE_CHOICE_SINGLE)
                .questionText("Qual comando consulta dados de uma tabela?")
                .points(20)
                .explanation("SELECT é o comando usado para consultar.")
                .order(0)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "GET", false, 0));
        options.add(createOption(question, "SELECT", true, 1));
        options.add(createOption(question, "QUERY", false, 2));
        options.add(createOption(question, "FETCH", false, 3));

        question.setOptions(options);
        questionRepository.save(question);
    }

    private void createQuestion2_2(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.MULTIPLE_CHOICE_SINGLE)
                .questionText("Como selecionar TODAS as colunas de 'usuarios'?")
                .points(20)
                .explanation("O asterisco (*) seleciona todas as colunas.")
                .order(1)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "SELECT ALL FROM usuarios;", false, 0));
        options.add(createOption(question, "SELECT * FROM usuarios;", true, 1));
        options.add(createOption(question, "GET * FROM usuarios;", false, 2));
        options.add(createOption(question, "FETCH ALL usuarios;", false, 3));

        question.setOptions(options);
        questionRepository.save(question);
    }

    private void createQuestion2_3(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.TRUE_FALSE)
                .questionText("SELECT nome, email FROM clientes retorna apenas essas colunas.")
                .points(20)
                .explanation("Verdadeiro. Apenas as colunas especificadas são retornadas.")
                .order(2)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Verdadeiro", true, 0));
        options.add(createOption(question, "Falso", false, 1));

        question.setOptions(options);
        questionRepository.save(question);
    }

    private void createQuestion2_4(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.ESSAY)
                .questionText("Para que serve ORDER BY? Dê um exemplo.")
                .points(40)
                .explanation("ORDER BY ordena os resultados.")
                .order(3)
                .isRequired(true)
                .build();

        questionRepository.save(question);
    }

    // ==================== AULA 3 ====================
    private void createLesson3(Module module) {
        log.info("📖 Criando Aula 3: WHERE - Filtrando Resultados");

        Lesson lesson = Lesson.builder()
                .title("WHERE - Filtrando Resultados")
                .description("Aprenda a filtrar dados com WHERE")
                .orderIndex(3)
                .durationMinutes(25)
                .module(module)
                .build();

        lesson = lessonRepository.save(lesson);

        createVideo(lesson, "WHERE - Filtrando com Precisão",
                "https://www.youtube.com/watch?v=EXAMPLE3");

        createAttachment(lesson, "Guia WHERE.pdf",
                "Guia completo da cláusula WHERE",
                "https://drive.google.com/file/d/3ABC789/view", AttachmentType.FILE);

        createExercise3(lesson);
    }

    private void createExercise3(Lesson lesson) {
        log.info("   📝 Criando exercício: Dominando WHERE");

        Exercise exercise = Exercise.builder()
                .title("Dominando WHERE")
                .description("Pratique filtros SQL")
                .instructions("Complete o quiz. Duração: 20 minutos.")
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
                .build();

        exercise = exerciseRepository.save(exercise);

        createQuestion3_1(exercise);
        createQuestion3_2(exercise);
        createQuestion3_3(exercise);
    }

    private void createQuestion3_1(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.MULTIPLE_CHOICE_SINGLE)
                .questionText("Qual operador busca padrões?")
                .points(33)
                .explanation("LIKE é usado para buscar padrões.")
                .order(0)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "IN", false, 0));
        options.add(createOption(question, "LIKE", true, 1));
        options.add(createOption(question, "CONTAINS", false, 2));
        options.add(createOption(question, "MATCH", false, 3));

        question.setOptions(options);
        questionRepository.save(question);
    }

    private void createQuestion3_2(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.MULTIPLE_CHOICE_MULTIPLE)
                .questionText("Quais são operadores lógicos em SQL?")
                .points(34)
                .explanation("AND, OR e NOT são operadores lógicos.")
                .order(1)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "AND", true, 0));
        options.add(createOption(question, "ALSO", false, 1));
        options.add(createOption(question, "OR", true, 2));
        options.add(createOption(question, "NOT", true, 3));

        question.setOptions(options);
        questionRepository.save(question);
    }

    private void createQuestion3_3(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.TRUE_FALSE)
                .questionText("WHERE preco > 100 AND categoria = 'Eletrônicos' retorna produtos eletrônicos caros.")
                .points(33)
                .explanation("Verdadeiro. AND exige ambas as condições.")
                .order(2)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Verdadeiro", true, 0));
        options.add(createOption(question, "Falso", false, 1));

        question.setOptions(options);
        questionRepository.save(question);
    }

    // ==================== AULA 4 ====================
    private void createLesson4(Module module) {
        log.info("📖 Criando Aula 4: INSERT, UPDATE, DELETE");

        Lesson lesson = Lesson.builder()
                .title("INSERT, UPDATE, DELETE")
                .description("Aprenda a manipular dados")
                .orderIndex(4)
                .durationMinutes(30)
                .module(module)
                .build();

        lesson = lessonRepository.save(lesson);

        createVideo(lesson, "Manipulando Dados - DML",
                "https://www.youtube.com/watch?v=EXAMPLE4");

        createAttachment(lesson, "Slides DML.pdf",
                "Comandos de manipulação de dados",
                "https://drive.google.com/file/d/4ABC321/view", AttachmentType.FILE);

        createExercise4(lesson);
    }

    private void createExercise4(Lesson lesson) {
        log.info("   📝 Criando exercício: DML na Prática");

        Exercise exercise = Exercise.builder()
                .title("DML na Prática")
                .description("Teste manipulação de dados")
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
                .build();

        exercise = exerciseRepository.save(exercise);

        createQuestion4_1(exercise);
        createQuestion4_2(exercise);
        createQuestion4_3(exercise);
    }

    private void createQuestion4_1(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.MULTIPLE_CHOICE_SINGLE)
                .questionText("Comando para adicionar registro?")
                .points(30)
                .explanation("INSERT INTO adiciona registros.")
                .order(0)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "ADD", false, 0));
        options.add(createOption(question, "INSERT INTO", true, 1));
        options.add(createOption(question, "CREATE", false, 2));
        options.add(createOption(question, "NEW", false, 3));

        question.setOptions(options);
        questionRepository.save(question);
    }

    private void createQuestion4_2(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.MULTIPLE_CHOICE_SINGLE)
                .questionText("Comando para atualizar registros?")
                .points(30)
                .explanation("UPDATE modifica registros.")
                .order(1)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "MODIFY", false, 0));
        options.add(createOption(question, "CHANGE", false, 1));
        options.add(createOption(question, "UPDATE", true, 2));
        options.add(createOption(question, "EDIT", false, 3));

        question.setOptions(options);
        questionRepository.save(question);
    }

    private void createQuestion4_3(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.TRUE_FALSE)
                .questionText("É importante SEMPRE usar WHERE em UPDATE e DELETE.")
                .points(40)
                .explanation("Verdadeiro. Sem WHERE, afeta TODOS os registros!")
                .order(2)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Verdadeiro", true, 0));
        options.add(createOption(question, "Falso", false, 1));

        question.setOptions(options);
        questionRepository.save(question);
    }

    // ==================== AULA 5 ====================
    private void createLesson5(Module module) {
        log.info("📖 Criando Aula 5: JOINs");

        Lesson lesson = Lesson.builder()
                .title("JOINs - Relacionamentos")
                .description("Combine dados de múltiplas tabelas")
                .orderIndex(5)
                .durationMinutes(35)
                .module(module)
                .build();

        lesson = lessonRepository.save(lesson);

        createVideo(lesson, "Entendendo JOINs",
                "https://www.youtube.com/watch?v=EXAMPLE5");

        createVideo(lesson, "JOINs na Prática",
                "https://www.youtube.com/watch?v=EXAMPLE5B");

        createAttachment(lesson, "Infográfico JOINs.pdf",
                "Visual dos tipos de JOINs",
                "https://drive.google.com/file/d/5ABC987/view", AttachmentType.LINK);

        createExercise5(lesson);
    }

    private void createExercise5(Lesson lesson) {
        log.info("   📝 Criando exercício: Desafio JOINs");

        Exercise exercise = Exercise.builder()
                .title("Desafio JOINs")
                .description("Teste domínio sobre JOINs")
                .instructions("Exercício avançado. Tempo: 30 minutos.")
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
                .build();

        exercise = exerciseRepository.save(exercise);

        createQuestion5_1(exercise);
        createQuestion5_2(exercise);
        createQuestion5_3(exercise);
        createQuestion5_4(exercise);
    }

    private void createQuestion5_1(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.MULTIPLE_CHOICE_SINGLE)
                .questionText("JOIN que retorna apenas registros em AMBAS as tabelas?")
                .points(30)
                .explanation("INNER JOIN retorna apenas correspondências.")
                .order(0)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "LEFT JOIN", false, 0));
        options.add(createOption(question, "RIGHT JOIN", false, 1));
        options.add(createOption(question, "INNER JOIN", true, 2));
        options.add(createOption(question, "FULL OUTER JOIN", false, 3));

        question.setOptions(options);
        questionRepository.save(question);
    }

    private void createQuestion5_2(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.MULTIPLE_CHOICE_SINGLE)
                .questionText("JOIN que retorna TODOS da esquerda?")
                .points(30)
                .explanation("LEFT JOIN retorna todos da esquerda.")
                .order(1)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "LEFT JOIN", true, 0));
        options.add(createOption(question, "RIGHT JOIN", false, 1));
        options.add(createOption(question, "INNER JOIN", false, 2));
        options.add(createOption(question, "CROSS JOIN", false, 3));

        question.setOptions(options);
        questionRepository.save(question);
    }

    private void createQuestion5_3(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.TRUE_FALSE)
                .questionText("RIGHT JOIN = LEFT JOIN trocando ordem?")
                .points(30)
                .explanation("Verdadeiro. A RIGHT JOIN B = B LEFT JOIN A.")
                .order(2)
                .isRequired(true)
                .build();

        List<QuestionOption> options = new ArrayList<>();
        options.add(createOption(question, "Verdadeiro", true, 0));
        options.add(createOption(question, "Falso", false, 1));

        question.setOptions(options);
        questionRepository.save(question);
    }

    private void createQuestion5_4(Exercise exercise) {
        Question question = Question.builder()
                .exercise(exercise)
                .type(QuestionType.ESSAY)
                .questionText("Explique a diferença entre INNER JOIN e LEFT JOIN com exemplos.")
                .points(60)
                .explanation("INNER: apenas com correspondência. LEFT: todos da esquerda.")
                .order(3)
                .isRequired(true)
                .build();

        questionRepository.save(question);
    }

    // ==================== HELPERS ====================

    private Video createVideo(Lesson lesson, String title, String url) {
        Video video = Video.builder()
                .title(title)
                .url(url)
                .storageType(VideoStorageType.URL)
                .lesson(lesson)
                .build();

        return videoRepository.save(video);
    }

    private Attachment createAttachment(Lesson lesson, String title, String description,
                                        String fileUrl, AttachmentType type) {
        Attachment attachment = Attachment.builder()
                .title(title)
                .description(description)
                .fileUrl(fileUrl)
                .type(type)
                .lesson(lesson)
                .build();

        return attachmentRepository.save(attachment);
    }

    private QuestionOption createOption(Question question, String text,
                                        boolean isCorrect, int orderIndex) {
        return QuestionOption.builder()
                .question(question)
                .optionText(text)
                .isCorrect(isCorrect)
                .order(orderIndex)
                .build();
    }
}