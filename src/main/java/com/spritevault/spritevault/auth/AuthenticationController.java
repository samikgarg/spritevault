package com.spritevault.spritevault.auth;

import com.spritevault.spritevault.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @Valid @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(service.refreshToken(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof com.spritevault.spritevault.user.User) {
            com.spritevault.spritevault.user.User user = (com.spritevault.spritevault.user.User) authentication.getPrincipal();
            service.logout(user.getId());
            return ResponseEntity.ok("Logged out successfully");
        }
        return ResponseEntity.status(401).body("Not authenticated");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof com.spritevault.spritevault.user.User) {
            com.spritevault.spritevault.user.User user = (com.spritevault.spritevault.user.User) authentication.getPrincipal();
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("Not authenticated");
    }
}
