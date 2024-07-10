package com.example.casa.API;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.casa.Controller.UserController;
import com.example.casa.Exception.ResourceNotFoundException;
import com.example.casa.Model.User;
import com.example.casa.Repository.UserRepository;
import com.example.casa.Security.UserPrincipal;

@SpringBootTest
class UserTests {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCurrentUser_Success() {
        User mockUser = new User();
        mockUser.setId("1");
        mockUser.setFirstName("John");
        mockUser.setLastName("Doe");
        mockUser.setEmail("john.doe@example.com");
        mockUser.setPassword("password");
        UserPrincipal mockUserPrincipal = UserPrincipal.create(mockUser);

        when(userRepository.findById("1")).thenReturn(Optional.of(mockUser));
        User result = userController.getCurrentUser(mockUserPrincipal);

        assertEquals(mockUser.getId(), result.getId());
        assertEquals(mockUser.getFirstName(), result.getFirstName());
        assertEquals(mockUser.getLastName(), result.getLastName());
        assertEquals(mockUser.getEmail(), result.getEmail());
    }

    @Test
    void testGetCurrentUser_NotFound() {
        UserPrincipal mockUserPrincipal = new UserPrincipal("2", "jane.doe@example.com", "password", null);

        when(userRepository.findById("2")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            userController.getCurrentUser(mockUserPrincipal);
        });
    }
}
