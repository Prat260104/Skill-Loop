package com.skillloop.server.dto;

public class InterviewPayload {
    public static class QuestionRequest {
        private String skill;
        private String difficulty;

        public QuestionRequest() {
        }

        public QuestionRequest(String skill, String difficulty) {
            this.skill = skill;
            this.difficulty = difficulty;
        }

        public String getSkill() {
            return skill;
        }

        public void setSkill(String skill) {
            this.skill = skill;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }
    }

    public static class AnswerRequest {
        private String question;
        private String userAnswer;
        private Long userId; // To save verification
        private String skill; // To save verification

        public AnswerRequest() {
        }

        public AnswerRequest(String question, String userAnswer, Long userId, String skill) {
            this.question = question;
            this.userAnswer = userAnswer;
            this.userId = userId;
            this.skill = skill;
        }

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public String getUserAnswer() {
            return userAnswer;
        }

        public void setUserAnswer(String userAnswer) {
            this.userAnswer = userAnswer;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getSkill() {
            return skill;
        }

        public void setSkill(String skill) {
            this.skill = skill;
        }
    }
}
