import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlueprintConsole } from '../../src/components/BlueprintConsole';
import React from 'react';

describe('BlueprintConsole Component', () => {
  it('renders correctly', () => {
    render(<BlueprintConsole />);
    expect(screen.getByPlaceholderText('Search architecture manual...')).toBeInTheDocument();
  });

  it('can search', () => {
    render(<BlueprintConsole />);
    const searchInput = screen.getByPlaceholderText('Search architecture manual...');
    fireEvent.change(searchInput, { target: { value: 'Agent Architecture' } });
    expect(searchInput).toHaveValue('Agent Architecture');
  });
});
