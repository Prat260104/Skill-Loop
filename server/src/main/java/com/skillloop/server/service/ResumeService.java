package com.skillloop.server.service;

import com.skillloop.server.dto.ResumeResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ResumeService {

    @Autowired
    private RestTemplate restTemplate;

    // Python ML Service URL
    private final String ML_SERVICE_URL = "http://127.0.0.1:8000/api/v1/resume/parse";

    public ResumeResponseDTO parseResume(MultipartFile file) throws IOException {
        // 1. Prepare Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // 2. Prepare Body (The File)
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        // We must override getFilename() for ByteArrayResource, otherwise the filename
        // is not sent
        // and FastAPI (python-multipart) might reject it.
        ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        body.add("file", fileResource);

        // 3. Create Request Entity
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // 4. Send Request to Python Service
        ResponseEntity<ResumeResponseDTO> response = restTemplate.postForEntity(
                ML_SERVICE_URL,
                requestEntity,
                ResumeResponseDTO.class);

        return response.getBody();
    }
}
