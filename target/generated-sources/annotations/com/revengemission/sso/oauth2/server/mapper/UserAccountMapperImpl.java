package com.revengemission.sso.oauth2.server.mapper;

import com.revengemission.sso.oauth2.server.domain.Role;
import com.revengemission.sso.oauth2.server.domain.UserAccount;
import com.revengemission.sso.oauth2.server.persistence.entity.RoleEntity;
import com.revengemission.sso.oauth2.server.persistence.entity.UserAccountEntity;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-29T11:25:25-0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.38.0.v20240417-1011, environment: Java 17.0.10 (Eclipse Adoptium)"
)
@Component
public class UserAccountMapperImpl implements UserAccountMapper {

    @Override
    public UserAccount entityToDto(UserAccountEntity entity) {
        if ( entity == null ) {
            return null;
        }

        UserAccount userAccount = new UserAccount();

        userAccount.setUsername( entity.getUsername() );
        userAccount.setDateCreated( entity.getDateCreated() );
        if ( entity.getId() != null ) {
            userAccount.setId( String.valueOf( entity.getId() ) );
        }
        userAccount.setLastModified( entity.getLastModified() );
        userAccount.setRecordStatus( entity.getRecordStatus() );
        userAccount.setRemarks( entity.getRemarks() );
        userAccount.setSortPriority( entity.getSortPriority() );
        userAccount.setVersion( entity.getVersion() );
        userAccount.setAccountOpenCode( entity.getAccountOpenCode() );
        userAccount.setAddress( entity.getAddress() );
        userAccount.setAvatarUrl( entity.getAvatarUrl() );
        userAccount.setBirthday( entity.getBirthday() );
        userAccount.setCity( entity.getCity() );
        userAccount.setEmail( entity.getEmail() );
        userAccount.setFailureCount( entity.getFailureCount() );
        userAccount.setFailureTime( entity.getFailureTime() );
        userAccount.setGender( entity.getGender() );
        userAccount.setMobile( entity.getMobile() );
        userAccount.setNickName( entity.getNickName() );
        userAccount.setPassword( entity.getPassword() );
        userAccount.setProvince( entity.getProvince() );
        userAccount.setRoles( roleEntityListToRoleList( entity.getRoles() ) );

        return userAccount;
    }

    @Override
    public UserAccountEntity dtoToEntity(UserAccount dto) {
        if ( dto == null ) {
            return null;
        }

        UserAccountEntity userAccountEntity = new UserAccountEntity();

        userAccountEntity.setUsername( dto.getUsername() );
        if ( dto.getId() != null ) {
            userAccountEntity.setId( Long.parseLong( dto.getId() ) );
        }
        userAccountEntity.setRecordStatus( dto.getRecordStatus() );
        userAccountEntity.setVersion( dto.getVersion() );
        userAccountEntity.setRemarks( dto.getRemarks() );
        userAccountEntity.setSortPriority( dto.getSortPriority() );
        userAccountEntity.setDateCreated( dto.getDateCreated() );
        userAccountEntity.setLastModified( dto.getLastModified() );
        userAccountEntity.setPassword( dto.getPassword() );
        userAccountEntity.setAccountOpenCode( dto.getAccountOpenCode() );
        userAccountEntity.setNickName( dto.getNickName() );
        userAccountEntity.setAvatarUrl( dto.getAvatarUrl() );
        userAccountEntity.setEmail( dto.getEmail() );
        userAccountEntity.setMobile( dto.getMobile() );
        userAccountEntity.setProvince( dto.getProvince() );
        userAccountEntity.setCity( dto.getCity() );
        userAccountEntity.setAddress( dto.getAddress() );
        userAccountEntity.setBirthday( dto.getBirthday() );
        userAccountEntity.setGender( dto.getGender() );
        userAccountEntity.setFailureTime( dto.getFailureTime() );
        userAccountEntity.setFailureCount( dto.getFailureCount() );
        userAccountEntity.setRoles( roleListToRoleEntityList( dto.getRoles() ) );

        return userAccountEntity;
    }

    protected Role roleEntityToRole(RoleEntity roleEntity) {
        if ( roleEntity == null ) {
            return null;
        }

        Role role = new Role();

        role.setDateCreated( roleEntity.getDateCreated() );
        if ( roleEntity.getId() != null ) {
            role.setId( String.valueOf( roleEntity.getId() ) );
        }
        role.setLastModified( roleEntity.getLastModified() );
        role.setRecordStatus( roleEntity.getRecordStatus() );
        role.setRemarks( roleEntity.getRemarks() );
        role.setSortPriority( roleEntity.getSortPriority() );
        role.setVersion( roleEntity.getVersion() );
        role.setRoleName( roleEntity.getRoleName() );

        return role;
    }

    protected List<Role> roleEntityListToRoleList(List<RoleEntity> list) {
        if ( list == null ) {
            return null;
        }

        List<Role> list1 = new ArrayList<Role>( list.size() );
        for ( RoleEntity roleEntity : list ) {
            list1.add( roleEntityToRole( roleEntity ) );
        }

        return list1;
    }

    protected RoleEntity roleToRoleEntity(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleEntity roleEntity = new RoleEntity();

        if ( role.getId() != null ) {
            roleEntity.setId( Long.parseLong( role.getId() ) );
        }
        roleEntity.setRecordStatus( role.getRecordStatus() );
        roleEntity.setVersion( role.getVersion() );
        roleEntity.setRemarks( role.getRemarks() );
        roleEntity.setSortPriority( role.getSortPriority() );
        roleEntity.setDateCreated( role.getDateCreated() );
        roleEntity.setLastModified( role.getLastModified() );
        roleEntity.setRoleName( role.getRoleName() );

        return roleEntity;
    }

    protected List<RoleEntity> roleListToRoleEntityList(List<Role> list) {
        if ( list == null ) {
            return null;
        }

        List<RoleEntity> list1 = new ArrayList<RoleEntity>( list.size() );
        for ( Role role : list ) {
            list1.add( roleToRoleEntity( role ) );
        }

        return list1;
    }
}
