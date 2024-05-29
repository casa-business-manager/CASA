package com.revengemission.sso.oauth2.server.mapper;

import com.revengemission.sso.oauth2.server.domain.LoginHistory;
import com.revengemission.sso.oauth2.server.persistence.entity.LoginHistoryEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-29T11:25:25-0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.38.0.v20240417-1011, environment: Java 17.0.10 (Eclipse Adoptium)"
)
@Component
public class LoginHistoryMapperImpl implements LoginHistoryMapper {

    @Override
    public LoginHistory entityToDto(LoginHistoryEntity entity) {
        if ( entity == null ) {
            return null;
        }

        LoginHistory loginHistory = new LoginHistory();

        loginHistory.setUsername( entity.getUsername() );
        loginHistory.setDateCreated( entity.getDateCreated() );
        if ( entity.getId() != null ) {
            loginHistory.setId( String.valueOf( entity.getId() ) );
        }
        loginHistory.setLastModified( entity.getLastModified() );
        loginHistory.setRecordStatus( entity.getRecordStatus() );
        loginHistory.setRemarks( entity.getRemarks() );
        loginHistory.setSortPriority( entity.getSortPriority() );
        loginHistory.setVersion( entity.getVersion() );
        loginHistory.setClientId( entity.getClientId() );
        loginHistory.setDevice( entity.getDevice() );
        loginHistory.setIp( entity.getIp() );

        return loginHistory;
    }

    @Override
    public LoginHistoryEntity dtoToEntity(LoginHistory dto) {
        if ( dto == null ) {
            return null;
        }

        LoginHistoryEntity loginHistoryEntity = new LoginHistoryEntity();

        loginHistoryEntity.setUsername( dto.getUsername() );
        if ( dto.getId() != null ) {
            loginHistoryEntity.setId( Long.parseLong( dto.getId() ) );
        }
        loginHistoryEntity.setRecordStatus( dto.getRecordStatus() );
        loginHistoryEntity.setVersion( dto.getVersion() );
        loginHistoryEntity.setRemarks( dto.getRemarks() );
        loginHistoryEntity.setSortPriority( dto.getSortPriority() );
        loginHistoryEntity.setDateCreated( dto.getDateCreated() );
        loginHistoryEntity.setLastModified( dto.getLastModified() );
        loginHistoryEntity.setClientId( dto.getClientId() );
        loginHistoryEntity.setIp( dto.getIp() );
        loginHistoryEntity.setDevice( dto.getDevice() );

        return loginHistoryEntity;
    }
}
