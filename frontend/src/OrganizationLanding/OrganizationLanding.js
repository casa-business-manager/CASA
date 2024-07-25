import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrganizationLanding.css";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EmailIcon from "@mui/icons-material/Email";
import UserManagement from "../UserManagement/UserManagement";
import SettingsButton from "../Settings/SettingsButton";

const OrganizationLanding = () => {
	const { orgId } = useParams();
	const navigate = useNavigate();

	const handleGroupsIconClick = () => {
		if (orgId) {
			navigate(`/userManagement/${orgId}`);
		} else {
			console.error("Organization ID is undefined");
		}
	};

	const handleCalendarIconClick = () => {
		navigate(`/organizationCalendar/${orgId}`);
	};

	const handleEmailIconClick = () => {
		navigate(`/emailEditor/`);
	};

	return (
		<div>
			<h1>Applications</h1>
			{/* Temp button for meeting locations */}
			<SettingsButton orgId={orgId} />
			<p>Organization ID: {orgId}</p>
			<div className="icon-container">
				<div className="icon-box" onClick={handleGroupsIconClick}>
					<GroupsIcon className="icon" />
					<div className="icon-label">Users</div>
				</div>
				<div className="icon-box" onClick={handleCalendarIconClick}>
					<CalendarTodayIcon className="icon" />
					<div className="icon-label">Calendar</div>
				</div>
				<div className="icon-box">
					<AccountBoxIcon className="icon" />
					<div className="icon-label">Account</div>
				</div>
				<div className="icon-box" onClick={handleEmailIconClick}>
					<EmailIcon className="icon" />
					<div className="icon-label">Email Editor</div>
				</div>
			</div>
		</div>
	);
};

export default OrganizationLanding;
