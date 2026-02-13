package com.meutcc.backend.content.subject;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectService {
    private final SubjectRepository subjectRepository;

    public List<SubjectDTO> findAllSubjects() {
        return subjectRepository.findAll()
                //stream, serve para transformar List e Sets em um fluxo de dados funcional
                .stream()
                .map(subject -> new SubjectDTO(
                        subject.getId(),
                        subject.getName(),
                        subject.getColor(),
                        subject.getDescription()
                ))
                .collect(Collectors.toList());
    }

}
