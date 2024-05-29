package com.revengemission.sso.oauth2.server.mapper;

import com.revengemission.sso.oauth2.server.domain.Role;
import com.revengemission.sso.oauth2.server.persistence.entity.RoleEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-29T11:25:25-0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.38.0.v20240417-1011, environment: Java 17.0.10 (Eclipse Adoptium)"
)
@Component
public class RoleMapperImpl implements RoleMapper {

    @Override
    public Role entityToDto(RoleEntity entity) {
        if ( entity == null ) {
            return null;
        }

        Role role = new Role();

        role.setRoleName( entity.getRoleName() );
        role.setDateCreated( entity.getDateCreated() );
        if ( entity.getId() != null ) {
            role.setId( String.valueOf( entity.getId() ) );
        }
        role.setLastModified( entity.getLastModified() );
        role.setRecordStatus( entity.getRecordStatus() );
        role.setRemarks( entity.getRemarks() );
        role.setSortPriority( entity.getSortPriority() );
        role.setVersion( entity.getVersion() );

        return role;
    }

    @Override
    public RoleEntity dtoToEntity(Role dto) {
        if ( dto == null ) {
            return null;
        }

        RoleEntity roleEntity = new RoleEntity();

        roleEntity.setRoleName( dto.getRoleName() );
        if ( dto.getId() != null ) {
            roleEntity.setId( Long.parseLong( dto.getId() ) );
        }
        roleEntity.setRecordStatus( dto.getRecordStatus() );
        roleEntity.setVersion( dto.getVersion() );
        roleEntity.setRemarks( dto.getRemarks() );
        roleEntity.setSortPriority( dto.getSortPriority() );
        roleEntity.setDateCreated( dto.getDateCreated() );
        roleEntity.setLastModified( dto.getLastModified() );

        return roleEntity;
    }
}
