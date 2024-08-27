import { createContext } from "react";

/// Tuple of [currentUser, setCurrentUser]
/// currentUesr is an object matching the format returned by the getCurrentUser API call
const CurrentUserContext = createContext([]);
export default CurrentUserContext;
