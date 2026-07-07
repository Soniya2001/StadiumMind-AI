import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MapVisualization } from '../../src/components/MapVisualization';
import React from 'react';

describe('MapVisualization Component', () => {
  it('renders correctly with default props', () => {
    const mockOnSelectZone = vi.fn();
    render(
      <MapVisualization
        activeScenarioId={null}
        selectedZone={null}
        onSelectZone={mockOnSelectZone}
      />
    );
    expect(screen.getByText('Normal / Safe')).toBeInTheDocument();
    expect(screen.getByText('Warning / Alert')).toBeInTheDocument();
    expect(screen.getByText('Critical Incident')).toBeInTheDocument();
    expect(screen.getByText('Transit Terminal')).toBeInTheDocument();
  });
});
