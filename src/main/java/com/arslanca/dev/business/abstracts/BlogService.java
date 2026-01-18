package com.arslanca.dev.business.abstracts;

import com.arslanca.dev.entities.BlogPost;

import java.util.List;

public interface BlogService {
    List<BlogPost> getAll();
    BlogPost add(BlogPost blogPost);
}
