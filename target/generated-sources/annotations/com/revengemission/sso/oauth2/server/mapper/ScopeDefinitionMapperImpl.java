package com.revengemission.sso.oauth2.server.mapper;

import com.revengemission.sso.oauth2.server.domain.ScopeDefinition;
import com.revengemission.sso.oauth2.server.persistence.entity.ScopeDefinitionEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-29T11:25:25-0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.38.0.v20240417-1011, environment: Java 17.0.10 (Eclipse Adoptium)"
)
@Component
public class ScopeDefinitionMapperImpl implements ScopeDefinitionMapper {

    @Override
    public ScopeDefinition entityToDto(ScopeDefinitionEntity entity) {
        if ( entity == null ) {
            return null;
        }

        ScopeDefinition scopeDefinition = new ScopeDefinition();

        scopeDefinition.setScope( entity.getScope() );
        scopeDefinition.setDateCreated( entity.getDateCreated() );
        if ( entity.getId() != null ) {
            scopeDefinition.setId( String.valueOf( entity.getId() ) );
        }
        scopeDefinition.setLastModified( entity.getLastModified() );
        scopeDefinition.setRecordStatus( entity.getRecordStatus() );
        scopeDefinition.setRemarks( entity.getRemarks() );
        scopeDefinition.setSortPriority( entity.getSortPriority() );
        scopeDefinition.setVersion( entity.getVersion() );
        scopeDefinition.setDefinition( entity.getDefinition() );

        return scopeDefinition;
    }

    @Override
    public ScopeDefinitionEntity dtoToEntity(ScopeDefinition dto) {
        if ( dto == null ) {
            return null;
        }

        ScopeDefinitionEntity scopeDefinitionEntity = new ScopeDefinitionEntity();

        scopeDefinitionEntity.setScope( dto.getScope() );
        if ( dto.getId() != null ) {
            scopeDefinitionEntity.setId( Long.parseLong( dto.getId() ) );
        }
        scopeDefinitionEntity.setRecordStatus( dto.getRecordStatus() );
        scopeDefinitionEntity.setVersion( dto.getVersion() );
        scopeDefinitionEntity.setRemarks( dto.getRemarks() );
        scopeDefinitionEntity.setSortPriority( dto.getSortPriority() );
        scopeDefinitionEntity.setDateCreated( dto.getDateCreated() );
        scopeDefinitionEntity.setLastModified( dto.getLastModified() );
        scopeDefinitionEntity.setDefinition( dto.getDefinition() );

        return scopeDefinitionEntity;
    }
}
