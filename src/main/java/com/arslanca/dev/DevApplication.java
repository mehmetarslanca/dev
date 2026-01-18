package com.arslanca.dev;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class DevApplication {

	public static void main(String[] args) {

		SpringApplication.run(DevApplication.class, args);
	}

}
