package com.cohortlink.server;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan("com.cohortlink.server.mapper")
@EnableCaching
@EnableAsync
@EnableScheduling
public class CohortLinkApplication {

    public static void main(String[] args) {
        SpringApplication.run(CohortLinkApplication.class, args);
    }
}
