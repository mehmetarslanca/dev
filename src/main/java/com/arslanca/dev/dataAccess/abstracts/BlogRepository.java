package com.arslanca.dev.dataAccess.abstracts;

import com.arslanca.dev.entities.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<BlogPost, Integer> {
}
