package com.be.dto;

import com.be.model.Role;
import com.be.model.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountDTO {
    private Long id;

    private String avatar;

    private String username;

    private String email;

    private String password;

    private String passwordSalt;

    private Set<Role> roles;

    private Status status;

}
