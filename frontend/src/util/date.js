export const getMMDDHHMM12hr = (date) => {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const year = date.getFullYear();

	const time3 = date.toLocaleTimeString([], { timeStyle: "short" });
	return `${month}/${day}, ${time3}`;
};
