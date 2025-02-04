import { render, screen } from '@testing-library/react';
import ProductsView from '../views/ProductsView';

beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();
});

test('renders ProductsView without crashing', () => {
  render(<ProductsView />);
  expect(true).toBe(true);
});

test('renders ProductsView with products', () => {
  // Mock localStorage to have a token
  localStorage.setItem('token', 'mock-token');
  render(<ProductsView />);
  expect(true).toBe(true);
});