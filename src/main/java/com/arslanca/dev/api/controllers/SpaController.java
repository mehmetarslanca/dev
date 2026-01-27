package com.arslanca.dev.api.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    // Forwards all paths that do not contain a dot (to exclude static files like .js, .css)
    // to index.html to allow React Router to handle the routing, except for API and Swagger endpoints.
    @GetMapping(value = "/**/{path:[^\\.]*}")
    public String forward(jakarta.servlet.http.HttpServletRequest request) {
        String path = request.getServletPath();
        if (path.startsWith("/api") || path.startsWith("/v3") || path.startsWith("/swagger-ui")) {
            return "forward:" + path;
        }
        return "forward:/index.html";
    }
}
