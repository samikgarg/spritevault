package com.spritevault.spritevault.auth;

import com.spritevault.spritevault.config.JWTService;
import com.spritevault.spritevault.token.RefreshTokenService;
import com.spritevault.spritevault.token.TokenRefreshException;
import com.spritevault.spritevault.user.Role;
import com.spritevault.spritevault.user.User;
import com.spritevault.spritevault.user.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;

    public AuthenticationResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email is already in use");
        }
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.createRefreshToken(user);
        log.info("User registered successfully: {}", user.getEmail());
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        log.info("Authenticating user with email: {}", request.getEmail());
        
        // First check if user exists
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));
        
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword())
            );
            
            var jwtToken = jwtService.generateToken(user);
            var refreshToken = refreshTokenService.createRefreshToken(user);
            log.info("User authenticated successfully: {}", user.getEmail());
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .refreshToken(refreshToken.getToken())
                    .build();
        } catch (BadCredentialsException e) {
            log.warn("Invalid password for user: {}", request.getEmail());
            throw new BadCredentialsException("Invalid password");
        } catch (Exception e) {
            log.error("Authentication failed for user: {}", request.getEmail(), e);
            throw e;
        }
    }

    public AuthenticationResponse refreshToken(TokenRefreshRequest request) {
        return refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(refreshToken -> {
                    User user = refreshToken.getUser();
                    String token = jwtService.generateToken(user);
                    return AuthenticationResponse.builder()
                            .token(token)
                            .refreshToken(refreshToken.getToken())
                            .build();
                })
                .orElseThrow(() -> new TokenRefreshException(
                    request.getRefreshToken(), 
                    "Refresh token not found!"
                ));
    }

    public void logout(Integer userId) {
        refreshTokenService.deleteByUserId(userId);
    }
}
