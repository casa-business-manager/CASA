package com.revengemission.sso.oauth2.server.config;

public enum CachesEnum {
    DefaultCache,
    SmsCaptchaCache(60 * 3),
    GraphCaptchaCache(60 * 5, 100000),
    CaptchaTimesCache(60 * 5, 100000),
    Oauth2ClientCache(60 * 60 * 2, 20),
    Oauth2AuthorizationCodeCache(60 * 3, 100000),
    Oauth2AuthorizationCodeFailureTimesCache(60 * 3, 100000),
    ;

    CachesEnum() {
    }

    CachesEnum(int ttl) {
        this.ttl = ttl;
    }

    CachesEnum(int ttl, int maxSize) {
        this.ttl = ttl;
        this.maxSize = maxSize;
    }

    private int maxSize = 100000;
    private int ttl = 60 * 5;

    public int getMaxSize() {
        return maxSize;
    }

    public int getTtl() {
        return ttl;
    }
}
