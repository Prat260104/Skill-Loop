package com.skillloop.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "github_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GithubProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String username;

    private int repoCount;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> languages;

    private String seniority;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> techStack;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> strengths;

    @Column(columnDefinition = "TEXT")
    private String summary;
}
