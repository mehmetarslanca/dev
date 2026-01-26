package com.arslanca.dev.business.abstracts;

import com.arslanca.dev.business.dto.requests.CreateBlogRequest;
import com.arslanca.dev.business.dto.responses.GetBlogResponse;

import java.util.List;

public interface BlogService {
    List<GetBlogResponse> getAll();
    void add(CreateBlogRequest request);
    void update(int id, CreateBlogRequest request);
    void delete(int id);


}
