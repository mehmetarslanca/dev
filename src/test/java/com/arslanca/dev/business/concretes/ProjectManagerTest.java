package com.arslanca.dev.business.concretes;

import com.arslanca.dev.adapters.GithubAdapter;
import com.arslanca.dev.business.dto.responses.GithubRepoResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ProjectManagerTest {

    private GithubAdapter githubAdapter;
    private ProjectManager projectManager;
    private List<GithubRepoResponse> mockRepos;

    @BeforeEach
    void setUp() {
        githubAdapter = Mockito.mock(GithubAdapter.class);
        projectManager = new ProjectManager(githubAdapter);
        mockRepos = new ArrayList<>();

        for (int i = 1; i <= 25; i++) {
            GithubRepoResponse repo = new GithubRepoResponse();
            repo.setName("Repo " + i);
            repo.setDescription("Description for Repo " + i);
            repo.setUrl("http://repo" + i + ".url");
            mockRepos.add(repo);
        }
    }

    @Test
    void getProjects_shouldReturnFirstPage_whenPageSizeIsFive() {
        Mockito.when(githubAdapter.getRepos()).thenReturn(mockRepos);

        List<GithubRepoResponse> result = projectManager.getProjects(1, 5);

        assertEquals(5, result.size());
        assertEquals("Repo 1", result.get(0).getName());
        assertEquals("Repo 5", result.get(4).getName());
    }

    @Test
    void getProjects_shouldReturnEmptyList_whenPageNumberExceedsTotalPages() {
        Mockito.when(githubAdapter.getRepos()).thenReturn(mockRepos);

        List<GithubRepoResponse> result = projectManager.getProjects(6, 5);

        assertTrue(result.isEmpty());
    }

    @Test
    void getProjects_shouldReturnRemainingRepos_whenLastPageHasFewerItems() {
        Mockito.when(githubAdapter.getRepos()).thenReturn(mockRepos);

        List<GithubRepoResponse> result = projectManager.getProjects(5, 6);

        assertEquals(1, result.size());
        assertEquals("Repo 25", result.get(0).getName());
    }

    @Test
    void getProjects_shouldReturnAllRepos_whenPageSizeExceedsTotalRepos() {
        Mockito.when(githubAdapter.getRepos()).thenReturn(mockRepos);

        List<GithubRepoResponse> result = projectManager.getProjects(1, 30);

        assertEquals(25, result.size());
    }
}