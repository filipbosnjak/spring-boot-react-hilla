package com.example.application.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    private static final Logger LOG = LoggerFactory.getLogger(AppConfig.class);

    @Bean
    public CommandLineRunner runner(
            ServerProperties serverProperties
    ) {
        return args -> {
            LOG.info("App started at: http://localhost:" + serverProperties.getPort());
        };
    }

}
