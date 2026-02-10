package com.ombrelune.controller;

import com.ombrelune.entity.Subscription;
import com.ombrelune.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<?> createSubscription(@RequestBody Subscription subscription) {
        try {
            Subscription saved = subscriptionService.createSubscription(subscription);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new HashMap<String, String>() {{
                        put("error", e.getMessage());
                    }});
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllSubscriptions() {
        try {
            List<Subscription> subscriptions = subscriptionService.findAll();
            return ResponseEntity.ok(subscriptions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, String>() {{
                        put("error", e.getMessage());
                    }});
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubscription(@PathVariable Long id) {
        return subscriptionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getSubscriptionByName(@PathVariable String name) {
        return subscriptionService.findByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubscription(@PathVariable Long id, @RequestBody Subscription subscription) {
        return subscriptionService.findById(id)
                .map(existing -> {
                    existing.setName(subscription.getName());
                    existing.setDescription(subscription.getDescription());
                    existing.setPrice(subscription.getPrice());
                    existing.setMaxBooksPerMonth(subscription.getMaxBooksPerMonth());
                    existing.setHasDownloads(subscription.getHasDownloads());
                    existing.setHasBookmarks(subscription.getHasBookmarks());

                    Subscription updated = subscriptionService.updateSubscription(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubscription(@PathVariable Long id) {
        try {
            subscriptionService.deleteSubscription(id);
            return ResponseEntity.ok(new HashMap<String, String>() {{
                put("message", "Subscription deleted successfully");
            }});
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, String>() {{
                        put("error", e.getMessage());
                    }});
        }
    }
}
