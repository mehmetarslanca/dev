package com.arslanca.dev.api.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    // Forwards all paths that do not contain a dot (to exclude static files like .js, .css)
    // to index.html to allow React Router to handle the routing.
    @GetMapping(value = "/**/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}
