package com.be.model;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Set;

@Entity
@Table(name = "account", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@NamedQueries({
        @NamedQuery(name = "Account.getPasswordSaltByUsername"
                , query = "select a.passwordSalt from Account  a where a.username=:username"),
        @NamedQuery(name = "Account.getListByUsername"
                , query = "Select a.id,a.username,a.avatar  from Account  a where a.username like :key")
})
@Getter
@Setter
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    private String avatar;

    @NotBlank
    @Size(max = 120)
    private String password;

    //    @NotBlank
    @Size(max = 120)
    private String passwordSalt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    @NotBlank
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "status_id", referencedColumnName = "id")
    private Status status;

    public Account(@NotBlank @Size(max = 20) String username, @NotBlank @Size(max = 50) @Email String email, @NotBlank @Size(max = 120) String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Account() {
    }

    public Account(Long id) {
        this.id = id;
    }

    public Account(@NotBlank @Size(max = 20) String username, @NotBlank @Size(max = 50) @Email String email, @NotBlank @Size(max = 120) String password, @Size(max = 120) String passwordSalt) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.passwordSalt = passwordSalt;
    }


    public Account(Long id, @NotBlank @Size(max = 20) String username, String avatar) {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
    }
}
