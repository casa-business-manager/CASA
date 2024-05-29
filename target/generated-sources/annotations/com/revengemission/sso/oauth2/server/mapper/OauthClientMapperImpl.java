package com.revengemission.sso.oauth2.server.mapper;

import com.revengemission.sso.oauth2.server.domain.OauthClient;
import com.revengemission.sso.oauth2.server.persistence.entity.OauthClientEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-29T11:43:44-0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.38.0.v20240417-1011, environment: Java 17.0.10 (Eclipse Adoptium)"
)
@Component
public class OauthClientMapperImpl implements OauthClientMapper {

    @Override
    public OauthClient entityToDto(OauthClientEntity entity) {
        if ( entity == null ) {
            return null;
        }

        OauthClient oauthClient = new OauthClient();

        oauthClient.setClientId( entity.getClientId() );
        oauthClient.setDateCreated( entity.getDateCreated() );
        if ( entity.getId() != null ) {
            oauthClient.setId( String.valueOf( entity.getId() ) );
        }
        oauthClient.setLastModified( entity.getLastModified() );
        oauthClient.setRecordStatus( entity.getRecordStatus() );
        oauthClient.setRemarks( entity.getRemarks() );
        oauthClient.setSortPriority( entity.getSortPriority() );
        oauthClient.setVersion( entity.getVersion() );
        if ( entity.getAccessTokenValidity() != null ) {
            oauthClient.setAccessTokenValidity( entity.getAccessTokenValidity() );
        }
        oauthClient.setAdditionalInformation( entity.getAdditionalInformation() );
        oauthClient.setApplicationName( entity.getApplicationName() );
        oauthClient.setAuthorities( entity.getAuthorities() );
        oauthClient.setAuthorizedGrantTypes( entity.getAuthorizedGrantTypes() );
        oauthClient.setAutoApprove( entity.getAutoApprove() );
        oauthClient.setClientSecret( entity.getClientSecret() );
        oauthClient.setExpirationDate( entity.getExpirationDate() );
        if ( entity.getRefreshTokenValidity() != null ) {
            oauthClient.setRefreshTokenValidity( entity.getRefreshTokenValidity() );
        }
        oauthClient.setResourceIds( entity.getResourceIds() );
        oauthClient.setScope( entity.getScope() );
        oauthClient.setWebServerRedirectUri( entity.getWebServerRedirectUri() );

        return oauthClient;
    }

    @Override
    public OauthClientEntity dtoToEntity(OauthClient dto) {
        if ( dto == null ) {
            return null;
        }

        OauthClientEntity oauthClientEntity = new OauthClientEntity();

        oauthClientEntity.setClientId( dto.getClientId() );
        oauthClientEntity.setDateCreated( dto.getDateCreated() );
        if ( dto.getId() != null ) {
            oauthClientEntity.setId( Long.parseLong( dto.getId() ) );
        }
        oauthClientEntity.setLastModified( dto.getLastModified() );
        oauthClientEntity.setRecordStatus( dto.getRecordStatus() );
        oauthClientEntity.setRemarks( dto.getRemarks() );
        oauthClientEntity.setSortPriority( dto.getSortPriority() );
        oauthClientEntity.setVersion( dto.getVersion() );
        oauthClientEntity.setAccessTokenValidity( dto.getAccessTokenValidity() );
        oauthClientEntity.setAdditionalInformation( dto.getAdditionalInformation() );
        oauthClientEntity.setApplicationName( dto.getApplicationName() );
        oauthClientEntity.setAuthorities( dto.getAuthorities() );
        oauthClientEntity.setAuthorizedGrantTypes( dto.getAuthorizedGrantTypes() );
        oauthClientEntity.setAutoApprove( dto.getAutoApprove() );
        oauthClientEntity.setClientSecret( dto.getClientSecret() );
        oauthClientEntity.setExpirationDate( dto.getExpirationDate() );
        oauthClientEntity.setRefreshTokenValidity( dto.getRefreshTokenValidity() );
        oauthClientEntity.setResourceIds( dto.getResourceIds() );
        oauthClientEntity.setScope( dto.getScope() );
        oauthClientEntity.setWebServerRedirectUri( dto.getWebServerRedirectUri() );

        return oauthClientEntity;
    }
}
