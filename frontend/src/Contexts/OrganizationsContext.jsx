import { createContext } from "react";

/// Tuple of [organizations, setOrganizations]
/// organizations is a list matching the format returned by getOrganizations
const OrganizationsContext = createContext([]);
export default OrganizationsContext;
