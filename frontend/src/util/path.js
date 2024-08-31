export const parseLocation = (location) => {
	const path = location.pathname;
	return path.split("/").filter((word) => word !== "");
};
