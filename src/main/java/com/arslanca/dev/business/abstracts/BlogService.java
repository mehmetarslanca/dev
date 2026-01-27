package com.arslanca.dev.business.abstracts;

import com.arslanca.dev.business.dto.requests.CreateBlogRequest;
import com.arslanca.dev.business.dto.responses.GetBlogResponse;
import org.springframework.data.domain.Page;


public interface BlogService {
    Page<GetBlogResponse> getAll(int pageNo, int pageSize);
    void add(CreateBlogRequest request);
    void update(int id, CreateBlogRequest request);
    void delete(int id);


}
