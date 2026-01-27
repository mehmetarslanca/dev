package com.arslanca.dev.api.controllers;

import com.arslanca.dev.business.abstracts.BlogService;
import com.arslanca.dev.business.dto.requests.CreateBlogRequest;
import com.arslanca.dev.business.dto.responses.GetBlogResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/blogs")
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    @GetMapping
    public Page<GetBlogResponse> getAll(
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ){
        return blogService.getAll(pageNo, pageSize);
    }

    @PostMapping
    public void add(@Valid @RequestBody CreateBlogRequest request){
        blogService.add(request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id){
        blogService.delete(id);
    }
    @PutMapping("/{id}")
    public void update(@PathVariable int id, @Valid @RequestBody CreateBlogRequest request) {
        blogService.update(id, request);
    }
}
