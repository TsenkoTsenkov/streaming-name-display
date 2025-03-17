import App from './pages/App';
import { render, screen } from '@testing-library/react';
import { AppProvider } from './context/AppContext';

test('renders streaming display title', () => {
  render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  const titleElement = screen.getByText(/streaming display/i);
  expect(titleElement).toBeInTheDocument();
});
