import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('handles clicking on different zones and triggers onSelectZone', () => {
    const mockOnSelectZone = vi.fn();
    render(
      <MapVisualization
        activeScenarioId={null}
        selectedZone={null}
        onSelectZone={mockOnSelectZone}
      />
    );

    // Get the transit loop element by its text and click it
    const transitZone = screen.getByText('TRANSPORTATION SHUTTLE LOOP & METRO BUS BAY');
    fireEvent.click(transitZone);
    expect(mockOnSelectZone).toHaveBeenCalledWith('transit_loop');

    // Click on Sector A
    const sectorA = screen.getByText('Sector A');
    fireEvent.click(sectorA);
    expect(mockOnSelectZone).toHaveBeenCalledWith('Sector_A');

    // Click on Sector B
    const sectorB = screen.getByText('Sector B');
    fireEvent.click(sectorB);
    expect(mockOnSelectZone).toHaveBeenCalledWith('Sector_B');

    // Click on Sector C
    const sectorC = screen.getByText('Sector C');
    fireEvent.click(sectorC);
    expect(mockOnSelectZone).toHaveBeenCalledWith('Sector_C');

    // Click on Sector D
    const sectorD = screen.getByText('Sector D');
    fireEvent.click(sectorD);
    expect(mockOnSelectZone).toHaveBeenCalledWith('Sector_D');

    // Click on Gate G1
    const g1 = screen.getByText('G1');
    fireEvent.click(g1);
    expect(mockOnSelectZone).toHaveBeenCalledWith('Gate_1');

    // Click on Gate G2
    const g2 = screen.getByText('G2');
    fireEvent.click(g2);
    expect(mockOnSelectZone).toHaveBeenCalledWith('Gate_2');

    // Click on Gate G3
    const g3 = screen.getByText('G3');
    fireEvent.click(g3);
    expect(mockOnSelectZone).toHaveBeenCalledWith('Gate_3');

    // Click on Gate G4
    const g4 = screen.getByText('G4');
    fireEvent.click(g4);
    expect(mockOnSelectZone).toHaveBeenCalledWith('Gate_4');

    // Click on Gate G5
    const g5 = screen.getByText('G5');
    fireEvent.click(g5);
    expect(mockOnSelectZone).toHaveBeenCalledWith('Gate_5');

    // Click on Plaza F
    const plazaF = screen.getByText('F');
    fireEvent.click(plazaF);
    expect(mockOnSelectZone).toHaveBeenCalledWith('Concession_Plaza_C');
  });

  it('renders the detailed popup when a zone is selected', () => {
    const mockOnSelectZone = vi.fn();
    
    // Render with "Gate_4" selected
    render(
      <MapVisualization
        activeScenarioId={null}
        selectedZone="Gate_4"
        onSelectZone={mockOnSelectZone}
      />
    );

    expect(screen.getByText('Gate 4 North Entrance')).toBeInTheDocument();
    expect(screen.getByText('18 mins')).toBeInTheDocument();
    expect(screen.getByText('31 mins')).toBeInTheDocument();
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();

    // Click on close button
    const closeBtn = screen.getByLabelText('Close details popup');
    fireEvent.click(closeBtn);
    expect(mockOnSelectZone).toHaveBeenCalledWith('');
  });

  it('renders different details for Sector_B, transit_loop, and Concession_Plaza_C', () => {
    const { rerender } = render(
      <MapVisualization
        activeScenarioId={null}
        selectedZone="Sector_B"
        onSelectZone={vi.fn()}
      />
    );
    expect(screen.getByText('Sector B Grandstands')).toBeInTheDocument();

    rerender(
      <MapVisualization
        activeScenarioId={null}
        selectedZone="transit_loop"
        onSelectZone={vi.fn()}
      />
    );
    expect(screen.getByText('Transportation Shuttle Loop')).toBeInTheDocument();

    rerender(
      <MapVisualization
        activeScenarioId={null}
        selectedZone="Concession_Plaza_C"
        onSelectZone={vi.fn()}
      />
    );
    expect(screen.getByText('Concession Plaza & Sector C')).toBeInTheDocument();
  });

  it('renders details for Gates and other Sectors correctly', () => {
    const { rerender } = render(
      <MapVisualization
        activeScenarioId={null}
        selectedZone="Gate_5"
        onSelectZone={vi.fn()}
      />
    );
    expect(screen.getByText('Gate 5 East Entrance')).toBeInTheDocument();

    rerender(
      <MapVisualization
        activeScenarioId={null}
        selectedZone="Gate_3"
        onSelectZone={vi.fn()}
      />
    );
    expect(screen.getByText('Gate 3 North East Entrance')).toBeInTheDocument();

    rerender(
      <MapVisualization
        activeScenarioId={null}
        selectedZone="Sector_D"
        onSelectZone={vi.fn()}
      />
    );
    expect(screen.getByText('Sector D Grandstands')).toBeInTheDocument();

    rerender(
      <MapVisualization
        activeScenarioId={null}
        selectedZone="unknown_zone"
        onSelectZone={vi.fn()}
      />
    );
    expect(screen.getByText('unknown zone')).toBeInTheDocument();
  });

  it('handles keyboard accessibility with Enter/Space on keydown', () => {
    const mockOnSelectZone = vi.fn();
    render(
      <MapVisualization
        activeScenarioId={null}
        selectedZone={null}
        onSelectZone={mockOnSelectZone}
      />
    );

    const sectorAElement = screen.getByText('Sector A').closest('g');
    expect(sectorAElement).toBeInTheDocument();

    // Trigger KeyDown with "Enter"
    fireEvent.keyDown(sectorAElement!, { key: 'Enter', code: 'Enter' });
    expect(mockOnSelectZone).toHaveBeenCalledWith('Sector_A');

    // Trigger KeyDown with "Space"
    fireEvent.keyDown(sectorAElement!, { key: ' ', code: 'Space' });
    expect(mockOnSelectZone).toHaveBeenCalledWith('Sector_A');

    // KeyDown with unrelated key shouldn't trigger anything
    mockOnSelectZone.mockClear();
    fireEvent.keyDown(sectorAElement!, { key: 'Escape', code: 'Escape' });
    expect(mockOnSelectZone).not.toHaveBeenCalled();
  });

  it('changes styles dynamically based on activeScenarioId', () => {
    const { rerender } = render(
      <MapVisualization
        activeScenarioId="transit_delay"
        selectedZone={null}
        onSelectZone={vi.fn()}
      />
    );
    expect(screen.getByText('🚨 SERVICE SUSPENDED (DELAY RISK)')).toBeInTheDocument();

    rerender(
      <MapVisualization
        activeScenarioId="medical_cardiac"
        selectedZone={null}
        onSelectZone={vi.fn()}
      />
    );
    // Under cardiac arrest, Gate 4 status might change
    expect(screen.getByText('✓ NORMAL SHUTTLE FREQUENCY')).toBeInTheDocument();

    rerender(
      <MapVisualization
        activeScenarioId="sustainability_spill"
        selectedZone={null}
        onSelectZone={vi.fn()}
      />
    );
    expect(screen.getByText('✓ NORMAL SHUTTLE FREQUENCY')).toBeInTheDocument();
  });
});

