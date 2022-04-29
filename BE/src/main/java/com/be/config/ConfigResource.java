package com.be.config;


import com.be.model.Role;
import com.be.model.Status;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfigResource {

    @Bean
    public Role roleUser(){return new Role(1L, "ROLE_USER");}

    @Bean
    public Role roleAdmin(){return new Role(2L, "ROLE_ADMIN");}

    @Bean
    public Status statusAccActived() {
        return new Status(1L, 1L, "USER_ACTIVED", "ACCOUNT");
    }

    @Bean
    public Status statusAccNotActived() {
        return new Status(3L, 0L, "USER_NOT_ACTIVED", "ACCOUNT");
    }

    @Bean
    public Status statusAccBanned() {
        return new Status(2L, 2L, "USER_BANNED", "ACCOUNT");
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    public Status sttTokenNotActived() {
        return new Status(6L, 0L, "TOKEN_NOT_ACTIVED", "TOKEN");
    }

    @Bean
    public Status sttTokenActived() {
        return new Status(5L, 1L, "TOKEN_ACTIVED", "TOKEN");
    }

}
