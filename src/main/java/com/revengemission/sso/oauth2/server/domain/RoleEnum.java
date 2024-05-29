package com.revengemission.sso.oauth2.server.domain;

public enum RoleEnum {

    /**
     * 普通用户
     */
    ROLE_USER("User"),
    /**
     * 管理员
     */
    ROLE_ADMIN("Admin"),
    /**
     * 超级
     */
    ROLE_SUPER("Super");

    private String meaning;

    public String getMeaning() {
        return meaning;
    }

    RoleEnum() {
    }

    RoleEnum(String meaning) {
        this.meaning = meaning;
    }
}
