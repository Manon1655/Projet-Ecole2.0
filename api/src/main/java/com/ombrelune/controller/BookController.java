package com.ombrelune.controller;

import com.ombrelune.dto.BookDTO;
import com.ombrelune.entity.Book;
import com.ombrelune.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookController {
    private final BookService bookService;

    @PostMapping
    public ResponseEntity<?> createBook(@RequestBody BookDTO bookDTO) {
        try {
            Book book = Book.builder()
                    .title(bookDTO.getTitle())
                    .author(bookDTO.getAuthor())
                    .description(bookDTO.getDescription())
                    .coverImage(bookDTO.getCoverImage())
                    .price(bookDTO.getPrice())
                    .rating(bookDTO.getRating())
                    .publicationDate(bookDTO.getPublicationDate())
                    .genre(bookDTO.getGenre())
                    .build();

            Book savedBook = bookService.createBook(book);

            BookDTO response = BookDTO.builder()
                    .id(savedBook.getId())
                    .title(savedBook.getTitle())
                    .author(savedBook.getAuthor())
                    .description(savedBook.getDescription())
                    .coverImage(savedBook.getCoverImage())
                    .price(savedBook.getPrice())
                    .rating(savedBook.getRating())
                    .publicationDate(savedBook.getPublicationDate())
                    .genre(savedBook.getGenre())
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new HashMap<String, String>() {{
                        put("error", "Failed to create book: " + e.getMessage());
                    }});
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllBooks() {
        try {
            List<Book> books = bookService.findAll();
            List<BookDTO> response = books.stream()
                    .map(book -> BookDTO.builder()
                            .id(book.getId())
                            .title(book.getTitle())
                            .author(book.getAuthor())
                            .description(book.getDescription())
                            .coverImage(book.getCoverImage())
                            .price(book.getPrice())
                            .rating(book.getRating())
                            .publicationDate(book.getPublicationDate())
                            .genre(book.getGenre())
                            .build())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, String>() {{
                        put("error", "Failed to fetch books: " + e.getMessage());
                    }});
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBook(@PathVariable Long id) {
        return bookService.findById(id)
                .map(book -> ResponseEntity.ok(BookDTO.builder()
                        .id(book.getId())
                        .title(book.getTitle())
                        .author(book.getAuthor())
                        .description(book.getDescription())
                        .coverImage(book.getCoverImage())
                        .price(book.getPrice())
                        .rating(book.getRating())
                        .publicationDate(book.getPublicationDate())
                        .genre(book.getGenre())
                        .build()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBooks(@RequestParam String title) {
        try {
            List<Book> books = bookService.searchByTitle(title);
            List<BookDTO> response = books.stream()
                    .map(book -> BookDTO.builder()
                            .id(book.getId())
                            .title(book.getTitle())
                            .author(book.getAuthor())
                            .description(book.getDescription())
                            .coverImage(book.getCoverImage())
                            .price(book.getPrice())
                            .rating(book.getRating())
                            .publicationDate(book.getPublicationDate())
                            .genre(book.getGenre())
                            .build())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, String>() {{
                        put("error", "Search failed: " + e.getMessage());
                    }});
        }
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<?> getBooksByGenre(@PathVariable String genre) {
        try {
            List<Book> books = bookService.findByGenre(genre);
            List<BookDTO> response = books.stream()
                    .map(book -> BookDTO.builder()
                            .id(book.getId())
                            .title(book.getTitle())
                            .author(book.getAuthor())
                            .description(book.getDescription())
                            .coverImage(book.getCoverImage())
                            .price(book.getPrice())
                            .rating(book.getRating())
                            .publicationDate(book.getPublicationDate())
                            .genre(book.getGenre())
                            .build())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, String>() {{
                        put("error", "Failed to fetch books: " + e.getMessage());
                    }});
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @RequestBody BookDTO bookDTO) {
        return bookService.findById(id)
                .map(book -> {
                    book.setTitle(bookDTO.getTitle());
                    book.setAuthor(bookDTO.getAuthor());
                    book.setDescription(bookDTO.getDescription());
                    book.setCoverImage(bookDTO.getCoverImage());
                    book.setPrice(bookDTO.getPrice());
                    book.setRating(bookDTO.getRating());
                    book.setPublicationDate(bookDTO.getPublicationDate());
                    book.setGenre(bookDTO.getGenre());

                    Book updated = bookService.updateBook(book);

                    BookDTO response = BookDTO.builder()
                            .id(updated.getId())
                            .title(updated.getTitle())
                            .author(updated.getAuthor())
                            .description(updated.getDescription())
                            .coverImage(updated.getCoverImage())
                            .price(updated.getPrice())
                            .rating(updated.getRating())
                            .publicationDate(updated.getPublicationDate())
                            .genre(updated.getGenre())
                            .build();

                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.ok(new HashMap<String, String>() {{
                put("message", "Book deleted successfully");
            }});
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, String>() {{
                        put("error", "Failed to delete book: " + e.getMessage());
                    }});
        }
    }
}
