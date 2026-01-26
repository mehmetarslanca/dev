package com.arslanca.dev.business.abstracts;

import com.arslanca.dev.business.dto.requests.CreatePinnedProjectRequest;
import com.arslanca.dev.business.dto.requests.UpdatePinnedProjectRequest;
import com.arslanca.dev.business.dto.responses.PinnedProjectResponse;

import java.util.List;

public interface PinnedProjectService {
    List<PinnedProjectResponse> getAll();
    void add(CreatePinnedProjectRequest request);
    void update(Long id, UpdatePinnedProjectRequest request);
    void delete(Long id);
}
