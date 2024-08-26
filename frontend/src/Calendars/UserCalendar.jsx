import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import BaseCalendar from "./BaseCalendar";
import { getOrganizations } from "../API/OrganizationAPI";
import { useParams } from "react-router-dom";

const UserCalendar = () => {
	const { userId } = useParams();
	const [organizations, setOrganizations] = useState([]);

	useEffect(() => {
		const fetchOrganizations = async () => {
			try {
				const organizationIds = (await getOrganizations()).map(
					(org) => org.orgId,
				);
				setOrganizations(organizationIds);
			} catch (error) {
				console.error("Error fetching organizations:", error);
			}
		};

		fetchOrganizations();
	}, [userId]);

	return <BaseCalendar orgIds={organizations} />;
};

export default UserCalendar;
