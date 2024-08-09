import { createContext } from "react";

/// This must be a list of objects {name, path} so clicking on the name routes to the path
const PathContext = createContext([]);

export default PathContext;
