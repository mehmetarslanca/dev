package com.arslanca.dev.business.concretes;

import com.arslanca.dev.adapters.GithubAdapter;
import com.arslanca.dev.business.abstracts.ProjectService;
import com.arslanca.dev.business.responses.GithubRepoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectManager implements ProjectService {

    private final GithubAdapter githubAdapter;


    @Override
    public List<GithubRepoResponse> getProjects() {
        return githubAdapter.getRepos();
    }
}
