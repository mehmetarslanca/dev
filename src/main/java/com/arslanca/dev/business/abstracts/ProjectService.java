package com.arslanca.dev.business.abstracts;

import com.arslanca.dev.business.responses.GithubRepoResponse;

import java.util.List;

public interface ProjectService {
    List<GithubRepoResponse> getProjects();
}
