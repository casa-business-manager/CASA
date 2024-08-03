package com.example.casa.Model;

public enum Permission {
	// basic permissions
	VIEW_USER_ROLES, VIEW_ORG_EVENTS, VIEW_ORG_USERS, // view
	INVITE_TO_ORG, INVITE_TO_EVENT, INVITE_TO_MEETING, // invite
	MANAGE_USER_ROLES, MANAGE_ORG_ROLES, MANAGE_ORG_EVENTS, MANAGE_OTHERS_EVENTS, MANAGE_ORG_USERS, MANAGE_ORG_DETAILS,
	// more advanced permissions that may not make final cut
	MESSAGE_UP, // permission to message users higher in role hierarchy
	INVITE_UP, // permission to invite users higher in role hierarchy to meeting/event
	ROLE_ASSIGN_UP, // permission to assign roles to users higher than that of the assigner
	ROLE_MANAGE_UP // permission to create roles with permissions higher than that of the assigner
}
