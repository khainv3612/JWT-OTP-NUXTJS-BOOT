package com.be.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "STATUS")
@Getter
@Setter
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "STATUS_ID")
    private Long statusId;

    @Column(name = "PAR_NAME")
    private String parName;

    @Column(name = "PAR_TYPE")
    private String parType;

    @OneToOne(mappedBy = "status")
    private Account account;

    public Status() {
    }

    public Status(Long id, Long statusId, String parName, String parType) {
        this.id = id;
        this.statusId = statusId;
        this.parName = parName;
        this.parType = parType;
    }
}
