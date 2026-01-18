package com.arslanca.dev.api.controllers;

import com.arslanca.dev.business.abstracts.ProjectService;
import com.arslanca.dev.business.responses.GithubRepoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectsController {

    private final ProjectService projectService;

     @GetMapping
    public List<GithubRepoResponse> getAll(){
         return projectService.getProjects();
     }

}
