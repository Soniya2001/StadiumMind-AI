import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConsoleTerminal } from '../../src/components/ConsoleTerminal';
import React from 'react';

describe('ConsoleTerminal Component', () => {
  it('renders correctly', () => {
    render(
      <ConsoleTerminal
        steps={[]}
        isSimulating={false}
        activeStepIndex={-1}
      />
    );
    expect(screen.getByText('Console Terminal')).toBeInTheDocument(); // Checking if the label or terminal renders
  });
});
