package com.arslanca.dev.business.concretes;

import com.arslanca.dev.adapters.GithubAdapter;
import com.arslanca.dev.business.abstracts.ProjectService;
import com.arslanca.dev.business.dto.responses.GithubRepoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectManager implements ProjectService {

    private final GithubAdapter githubAdapter;


    @Override
    public List<GithubRepoResponse> getProjects(int pageNo, int pageSize) {
        List<GithubRepoResponse> allRepos = githubAdapter.getRepos();

        PageRequest pageRequest = PageRequest.of(pageNo - 1, pageSize);
        int start = (int) pageRequest.getOffset();
        int end = Math.min((start + pageRequest.getPageSize()), allRepos.size());

        if (start >= allRepos.size()) {
            return List.of();
        }

        return allRepos.subList(start, end);
    }
}
