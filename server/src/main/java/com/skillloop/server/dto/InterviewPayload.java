package com.skillloop.server.dto;

public class InterviewPayload {
    public static class QuestionRequest {
        private String skill;
        private String difficulty;

        @com.fasterxml.jackson.annotation.JsonProperty("user_id")
        @com.fasterxml.jackson.annotation.JsonAlias({ "userId", "user_id" })
        private Long userId;

        public QuestionRequest() {
        }

        public QuestionRequest(String skill, String difficulty, Long userId) {
            this.skill = skill;
            this.difficulty = difficulty;
            this.userId = userId;
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

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }
    }

    public static class AnswerRequest {
        private String question;
        @com.fasterxml.jackson.annotation.JsonProperty("user_answer")
        @com.fasterxml.jackson.annotation.JsonAlias("userAnswer")
        private String userAnswer;

        @com.fasterxml.jackson.annotation.JsonAlias({ "userId", "user_id" })
        private Long userId; // To save verification

        @com.fasterxml.jackson.annotation.JsonAlias({ "skill" })
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
