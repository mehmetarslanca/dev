package com.arslanca.dev.api.controllers;

import com.arslanca.dev.business.abstracts.BlogService;
import com.arslanca.dev.business.requests.CreateBlogRequest;
import com.arslanca.dev.entities.BlogPost;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/blogs")
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    @GetMapping
    public List<BlogPost> getAll(){
        return blogService.getAll();
    }

    @PostMapping
    public void add(@RequestBody CreateBlogRequest request){
        blogService.add(request);
    }
}
