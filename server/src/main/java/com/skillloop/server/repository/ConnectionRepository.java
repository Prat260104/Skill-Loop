package com.skillloop.server.repository;

import com.skillloop.server.model.ConnectionRequest;
import com.skillloop.server.model.ConnectionStatus;
import com.skillloop.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<ConnectionRequest, Long> {

    // Check if a request already exists between two users
    boolean existsBySenderAndReceiver(User sender, User receiver);

    // Get a specific request between two users
    Optional<ConnectionRequest> findBySenderAndReceiver(User sender, User receiver);

    // Get all pending requests for a user (Incoming)
    List<ConnectionRequest> findByReceiverAndStatus(User receiver, ConnectionStatus status);
}
