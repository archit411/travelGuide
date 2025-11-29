package com.travelGuide.travelGuide.repositories;

import com.travelGuide.travelGuide.model.TripItinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TripItineraryRepository extends JpaRepository<TripItinerary, UUID> {

    /**
     * Find all itineraries for a given user.
     */
    List<TripItinerary> findByUserId(String userId);

    /**
     * Optional convenience: find itineraries for a user ordered by creation time (most recent first).
     * Requires TripItinerary.createdAt field to be mapped.
     */
    List<TripItinerary> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Optional convenience: find by destination (case-insensitive).
     */
    List<TripItinerary> findByDestinationIgnoreCase(String destination);
}