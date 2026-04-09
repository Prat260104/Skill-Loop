package com.skillloop.server.dto;

import java.util.List;
import java.util.Set;
import com.skillloop.server.model.Badge;

public class UserSummaryDTO {
    private Long id;
    private String name;
    private String email;
    private String bio;
    private List<String> skillsOffered;
    private List<String> skillsWanted;
    private List<String> experience;
    private int skillPoints;
    private String role;
    private Double matchScore;
    private List<String> verifiedSkills;
    private Set<Badge> badges;

    public UserSummaryDTO(Long id, String name, String email, String bio, List<String> skillsOffered,
            List<String> skillsWanted, List<String> experience, int skillPoints, String role,
            List<String> verifiedSkills, Double matchScore, Set<Badge> badges) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.bio = bio;
        this.skillsOffered = skillsOffered;
        this.skillsWanted = skillsWanted;
        this.experience = experience;
        this.skillPoints = skillPoints;
        this.role = role;
        this.verifiedSkills = verifiedSkills;
        this.matchScore = matchScore;
        this.badges = badges;
    }

    public UserSummaryDTO(Long id, String name, String email, String bio, List<String> skillsOffered,
            List<String> skillsWanted, List<String> experience, int skillPoints, String role,
            List<String> verifiedSkills, Set<Badge> badges) {
        this(id, name, email, bio, skillsOffered, skillsWanted, experience, skillPoints, role, verifiedSkills, 0.0, badges);
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

    public List<String> getExperience() {
        return experience;
    }

    public void setExperience(List<String> experience) {
        this.experience = experience;
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

    public List<String> getVerifiedSkills() {
        return verifiedSkills;
    }

    public void setVerifiedSkills(List<String> verifiedSkills) {
        this.verifiedSkills = verifiedSkills;
    }

    public Double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Double matchScore) {
        this.matchScore = matchScore;
    }

    public Set<Badge> getBadges() {
        return badges;
    }

    public void setBadges(Set<Badge> badges) {
        this.badges = badges;
    }
}
