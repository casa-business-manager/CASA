import React from "react";
import { useParams } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import BaseCalendar from "./BaseCalendar";

const OrganizationCalendar = () => {
	const { orgId } = useParams();

	return (
		<div className="OrganizationCalendar">
			<BaseCalendar orgIds={[orgId]} />
		</div>
	);
};

export default OrganizationCalendar;
