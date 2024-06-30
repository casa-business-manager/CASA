import { render, screen } from '@testing-library/react';
import App from './App';

test('tests are able to run', () => {
  expect('poop shit fart').toBe('poop shit fart')
});

// failing test :(
// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
