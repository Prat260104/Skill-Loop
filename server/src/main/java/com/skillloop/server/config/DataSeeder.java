package com.skillloop.server.config;

import com.skillloop.server.model.User;
import com.skillloop.server.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner loadData(UserRepository userRepository) {
        return args -> {
            // Check if data already exists to prevent duplicates
            if (userRepository.count() < 5) {
                System.out.println("SEEDING DUMMY USERS... 🌱");

                // 1. Student Steve (Looking for Python/ML)
                User steve = new User("Student Steve", "steve@example.com", "password", "STUDENT");
                steve.setBio(
                        "I am a student passionate about AI and Machine Learning. I want to build a career in Data Science.");
                steve.setSkillsOffered(List.of("HTML", "CSS", "JavaScript")); // Knows Basics
                steve.setSkillsWanted(List.of("Python", "Machine Learning", "Deep Learning")); // Wants AI
                userRepository.save(steve);

                // 2. Mentor Mike (Offers Python/ML) - PERFECT MATCH FOR STEVE
                User mike = new User("Mentor Mike", "mike@example.com", "password", "MENTOR");
                mike.setBio("Senior AI Engineer at Google. Expert in Python and TensorFlow.");
                mike.setSkillsOffered(List.of("Python", "Machine Learning", "TensorFlow", "PyTorch"));
                mike.setSkillsWanted(List.of("Cooking"));
                userRepository.save(mike);

                // 3. Mentor Sarah (Offers Java) - NO MATCH
                User sarah = new User("Mentor Sarah", "sarah@example.com", "password", "MENTOR");
                sarah.setBio(
                        "Backend Developer with 10 years of Java experience. helping students master Spring Boot.");
                sarah.setSkillsOffered(List.of("Java", "Spring Boot", "Microservices"));
                sarah.setSkillsWanted(List.of("Dancing"));
                userRepository.save(sarah);

                // 4. Mentor Dave (Offers React) - NO MATCH
                User dave = new User("Mentor Dave", "dave@example.com", "password", "MENTOR");
                dave.setBio("Frontend Architect loving React and Next.js.");
                dave.setSkillsOffered(List.of("React", "Node.js", "Redux"));
                dave.setSkillsWanted(List.of("Gardening"));
                userRepository.save(dave);

                // 5. Student Emma (Wants Java) - MATCH FOR SARAH
                User emma = new User("Student Emma", "emma@example.com", "password", "STUDENT");
                emma.setBio("I want to become a backend engineer. Learning Java.");
                emma.setSkillsOffered(List.of("Python"));
                emma.setSkillsWanted(List.of("Java", "Spring Boot"));
                userRepository.save(emma);

                System.out.println("SEEDING COMPLETE! ✅");
            } else {
                System.out.println("Users already exist. Skipping seeding. 🚀");
            }
        };
    }
}
