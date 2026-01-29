package com.skillloop.server.dto;

import java.util.List;
import java.util.Map;
import lombok.Data;

public class ResumeResponseDTO {
    private String name;
    private String email;
    private List<String> skills;
    private List<Map<String, String>> experience;
    private Integer raw_text_length;

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

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<Map<String, String>> getExperience() {
        return experience;
    }

    public void setExperience(List<Map<String, String>> experience) {
        this.experience = experience;
    }

    public Integer getRaw_text_length() {
        return raw_text_length;
    }

    public void setRaw_text_length(Integer raw_text_length) {
        this.raw_text_length = raw_text_length;
    }
}
