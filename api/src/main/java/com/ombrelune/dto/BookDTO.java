package com.ombrelune.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private String description;
    private String coverImage;
    private Double price;
    private Integer rating;
    private String publicationDate;
    private String genre;
}
