import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../API/UserAPI";

const CurrentUserContext = createContext([]);

const CurrentUserProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		const callGetCurrentUser = async () => {
			try {
				const response = await getCurrentUser();
				setCurrentUser(response);
			} catch (error) {
				console.error("Error fetching current user:", error);
			}
		};

		callGetCurrentUser();
	}, []);

	return (
		<CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
			{children}
		</CurrentUserContext.Provider>
	);
};

export { CurrentUserProvider };
export default CurrentUserContext;
