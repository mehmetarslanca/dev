package com.arslanca.dev.api.controllers;

import com.arslanca.dev.business.abstracts.PinnedProjectService;
import com.arslanca.dev.business.dto.requests.CreatePinnedProjectRequest;
import com.arslanca.dev.business.dto.requests.UpdatePinnedProjectRequest;
import com.arslanca.dev.business.dto.responses.PinnedProjectResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pinned-projects")
@RequiredArgsConstructor
public class PinnedProjectController {

    private final PinnedProjectService service;

    @GetMapping
    public List<PinnedProjectResponse> getAll() {
        return service.getAll();
    }

    @PostMapping("/admin/add")
    public ResponseEntity<Void> add(@RequestBody @Valid CreatePinnedProjectRequest request) {
        service.add(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admin/update/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody @Valid UpdatePinnedProjectRequest request) {
        service.update(id, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
