package com.skillloop.server.dto;

public class SessionRequest {
    private Long mentorId; // Who I want to learn from
    private String skill; // What I want to learn
    // We can add scheduledTime later

    public SessionRequest() {
    }

    public SessionRequest(Long mentorId, String skill) {
        this.mentorId = mentorId;
        this.skill = skill;
    }

    public Long getMentorId() {
        return mentorId;
    }

    public void setMentorId(Long mentorId) {
        this.mentorId = mentorId;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    @Override
    public String toString() {
        return "SessionRequest{" +
                "mentorId=" + mentorId +
                ", skill='" + skill + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        SessionRequest that = (SessionRequest) o;

        if (mentorId != null ? !mentorId.equals(that.mentorId) : that.mentorId != null)
            return false;
        return skill != null ? skill.equals(that.skill) : that.skill == null;
    }

    @Override
    public int hashCode() {
        int result = mentorId != null ? mentorId.hashCode() : 0;
        result = 31 * result + (skill != null ? skill.hashCode() : 0);
        return result;
    }
}
