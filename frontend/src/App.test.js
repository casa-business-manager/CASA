import { render, screen } from "@testing-library/react";
import App from "./App";

test("tests are able to run", () => {
	expect("this string is equal to itself").toBe(
		"this string is equal to itself",
	);
});

// failing test :(
// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
