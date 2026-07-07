import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConsoleTerminal } from '../../src/components/ConsoleTerminal';
import React from 'react';

describe('ConsoleTerminal Component', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('renders correctly when in standby with no steps', () => {
    render(
      <ConsoleTerminal
        steps={[]}
        isSimulating={false}
        activeStepIndex={-1}
      />
    );
    expect(screen.getByText('STADIUMMIND_OS_BUS_CONSOLE')).toBeInTheDocument();
    expect(screen.getByText('Awaiting incident trigger trace...')).toBeInTheDocument();
  });

  it('renders active steps with themes and can expand details', () => {
    const mockSteps: any[] = [
      {
        agentId: 'fan',
        agentName: 'Fan Agent',
        actionType: 'THINKING',
        message: 'Fan agent analyzing crowd levels',
        details: 'Dispatched check to corridor 12',
        toolName: 'checkCrowdDensity',
        toolArgs: { corridorId: 12 },
        targetAgentId: 'crowd',
      },
      {
        agentId: 'transit',
        agentName: 'Transit Agent',
        actionType: 'TOOL_CALL',
        message: 'Transit agent checking shuttle schedules',
        details: 'Checking backup buses',
        toolName: 'dispatchShuttle',
        toolArgs: { busCount: 2 },
      },
      {
        agentId: 'emergency',
        agentName: 'Emergency Coordinator',
        actionType: 'COMMUNICATION',
        message: 'Emergency coordinator dispatching responder',
        details: 'EPI-Pen ready at Gate A',
      },
      {
        agentId: 'volunteer',
        agentName: 'Volunteer Agent',
        actionType: 'DECISION',
        message: 'Volunteer Copilot opening gate A',
        details: 'Clearing route',
      },
      {
        agentId: 'sustainability',
        agentName: 'Sustainability Agent',
        actionType: 'UNKNOWN',
        message: 'Sustainability agent feedback',
        details: 'Generic test',
      },
      {
        agentId: 'crowd',
        agentName: 'Crowd Agent',
        actionType: 'THINKING',
        message: 'Crowd Intelligence agent active',
        details: 'Monitoring density',
      },
      {
        agentId: 'unknown_id',
        agentName: 'Unknown Agent',
        actionType: 'UNKNOWN',
        message: 'Default core supervisor fallback message',
        details: 'Fallback check',
      },
      {
        agentId: 'sustainability',
        agentName: 'Sustainability Agent',
        actionType: 'THINKING',
        message: 'Ignored off-bounds message',
        details: 'Should not render',
      }
    ];

    render(
      <ConsoleTerminal
        steps={mockSteps}
        activeStepIndex={6}
        isSimulating={true}
      />
    );

    // Verify step messages up to index 6 are displayed
    expect(screen.getByText('Fan agent analyzing crowd levels')).toBeInTheDocument();
    expect(screen.getByText('Transit agent checking shuttle schedules')).toBeInTheDocument();
    expect(screen.getByText('Emergency coordinator dispatching responder')).toBeInTheDocument();
    expect(screen.getByText('Volunteer Copilot opening gate A')).toBeInTheDocument();
    expect(screen.getByText('Crowd Intelligence agent active')).toBeInTheDocument();
    expect(screen.getByText('Default core supervisor fallback message')).toBeInTheDocument();
    
    // Step at index 7 should NOT be in the document (since activeStepIndex is 6)
    expect(screen.queryByText('Ignored off-bounds message')).not.toBeInTheDocument();

    // Verify tool calls / peer annotations are visible
    expect(screen.getByText('API: checkCrowdDensity')).toBeInTheDocument();
    expect(screen.getByText('PEER: @crowd')).toBeInTheDocument();

    // Verify simulation status indicator is displayed (since activeStepIndex 6 < steps.length 8 - 1)
    expect(screen.getByText('NEXT AGENT COMMUNICATING IN TRACE...')).toBeInTheDocument();

    // Expand the first step
    const expandBtn = screen.getAllByText('[+] EXPAND COGNITIVE STATE')[0];
    fireEvent.click(expandBtn);

    // Verify detailed processes and JSON payloads are now rendered
    expect(screen.getByText('Dispatched check to corridor 12')).toBeInTheDocument();
    expect(screen.getByText('Tool Execution Payload:')).toBeInTheDocument();

    // Collapse the first step
    const collapseBtn = screen.getByText('[-] COLLAPSE REASONING');
    fireEvent.click(collapseBtn);
    expect(screen.queryByText('Dispatched check to corridor 12')).not.toBeInTheDocument();
  });
});

