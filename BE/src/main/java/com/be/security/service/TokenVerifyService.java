package com.be.security.service;

import com.be.config.Constants;
import com.be.model.Account;
import com.be.model.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import javax.persistence.EntityManager;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service("tokenVerifyService")
public class TokenVerifyService {

    @Value("${EXPIRATION_VERIFY_ACTIVE}")
    int expire;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    Status sttTokenNotActived;

    @Autowired
    Status sttTokenActived;

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Autowired
    private EntityManager entityManager;
}