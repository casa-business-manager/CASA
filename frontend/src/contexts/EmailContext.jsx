import { createContext } from "react";

/// Tuple of [people, setPeople]
/// people is a list of users to be displayed in email recipients list
const EmailContext = createContext([]);
export default EmailContext;
