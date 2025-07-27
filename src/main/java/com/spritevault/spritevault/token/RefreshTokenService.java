package com.spritevault.spritevault.token;

import com.spritevault.spritevault.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-token.expiration}")
    private long refreshTokenDurationMs;

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        log.info("Creating refresh token for user: {}", user.getEmail());
        
        // Delete any existing refresh tokens for this user
        int deletedCount = refreshTokenRepository.deleteByUserId(user.getId());
        log.info("Deleted {} existing refresh tokens for user: {}", deletedCount, user.getEmail());
        
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        log.info("Successfully created refresh token for user: {}", user.getEmail());
        return savedToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public void deleteByUserId(Integer userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }
}
