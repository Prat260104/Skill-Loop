package com.skillloop.server.dto;

import java.util.List;

public class UserSummaryDTO {
    private Long id;
    private String name;
    private String email;
    private String bio;
    private List<String> skillsOffered;
    private List<String> skillsWanted;
    private int skillPoints;
    private String role;

    public UserSummaryDTO(Long id, String name, String email, String bio, List<String> skillsOffered,
            List<String> skillsWanted, int skillPoints, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.bio = bio;
        this.skillsOffered = skillsOffered;
        this.skillsWanted = skillsWanted;
        this.skillPoints = skillPoints;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public List<String> getSkillsOffered() {
        return skillsOffered;
    }

    public void setSkillsOffered(List<String> skillsOffered) {
        this.skillsOffered = skillsOffered;
    }

    public List<String> getSkillsWanted() {
        return skillsWanted;
    }

    public void setSkillsWanted(List<String> skillsWanted) {
        this.skillsWanted = skillsWanted;
    }

    public int getSkillPoints() {
        return skillPoints;
    }

    public void setSkillPoints(int skillPoints) {
        this.skillPoints = skillPoints;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
