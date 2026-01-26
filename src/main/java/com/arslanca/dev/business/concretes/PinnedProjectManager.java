package com.arslanca.dev.business.concretes;

import com.arslanca.dev.business.abstracts.PinnedProjectService;
import com.arslanca.dev.business.dto.requests.CreatePinnedProjectRequest;
import com.arslanca.dev.business.dto.requests.UpdatePinnedProjectRequest;
import com.arslanca.dev.business.dto.responses.PinnedProjectResponse;
import com.arslanca.dev.business.mappers.PinnedProjectMapper;
import com.arslanca.dev.dataAccess.PinnedProjectRepository;
import com.arslanca.dev.entities.PinnedProject;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PinnedProjectManager implements PinnedProjectService {

    private final PinnedProjectRepository repository;
    private final PinnedProjectMapper mapper;

    @Override
    public List<PinnedProjectResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void add(CreatePinnedProjectRequest request) {
        PinnedProject project = mapper.toEntity(request);
        repository.save(project);
    }

    @Override
    public void update(Long id, UpdatePinnedProjectRequest request) {
        PinnedProject project = repository.findById(id).orElseThrow();
        mapper.updateEntityFromRequest(request, project);
        repository.save(project);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
