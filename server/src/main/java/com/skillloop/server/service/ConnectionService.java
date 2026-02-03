package com.skillloop.server.service;

import com.skillloop.server.model.ConnectionRequest;
import com.skillloop.server.model.ConnectionStatus;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.ConnectionRepository;
import com.skillloop.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private UserRepository userRepository;

    public ConnectionRequest sendConnectionRequest(Long senderId, Long receiverId) {
        if (senderId.equals(receiverId)) {
            throw new RuntimeException("Cannot connect with yourself");
        }

        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Check if request already exists
        if (connectionRepository.existsBySenderAndReceiver(sender, receiver)) {
            throw new RuntimeException("Request already exists");
        }

        ConnectionRequest request = new ConnectionRequest(sender, receiver, ConnectionStatus.PENDING);
        return connectionRepository.save(request);
    }

    public ConnectionStatus getConnectionStatus(Long senderId, Long receiverId) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Optional<ConnectionRequest> request = connectionRepository.findBySenderAndReceiver(sender, receiver);
        return request.map(ConnectionRequest::getStatus).orElse(null);
    }

    public List<ConnectionRequest> getPendingRequests(Long receiverId) {
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("User not found"));
        return connectionRepository.findByReceiverAndStatus(receiver, ConnectionStatus.PENDING);
    }

    public void acceptRequest(Long requestId) {
        ConnectionRequest request = connectionRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(ConnectionStatus.ACCEPTED);
        connectionRepository.save(request);
    }

    public void rejectRequest(Long requestId) {
        ConnectionRequest request = connectionRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(ConnectionStatus.REJECTED);
        connectionRepository.save(request);
    }
}
