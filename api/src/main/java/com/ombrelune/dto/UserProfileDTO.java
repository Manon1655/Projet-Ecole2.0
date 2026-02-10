package com.ombrelune.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String bio;
    private String phoneNumber;
    private Long subscriptionId;
    private String subscriptionName;
    private String createdAt;
}
