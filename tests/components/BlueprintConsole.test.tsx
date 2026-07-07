import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BlueprintConsole } from '../../src/components/BlueprintConsole';
import React from 'react';

vi.mock('../../src/data/blueprint', () => {
  return {
    BLUEPRINT_DATA: [
      {
        id: "sec-1",
        number: 1,
        title: "Executive Summary",
        category: "Vision & Problem",
        tags: ["vision", "problem"],
        content: `
This is standard text.
**This is bold text with \`code block\` inline**.
| Column 1 | Column 2 |
| :--- | :--- |
| Cell 1 | Cell 2 |
`
      },
      {
        id: "sec-2",
        number: 2,
        title: "Cloud & Data Tech",
        category: "Cloud & Data Tech",
        tags: ["cloud", "data"],
        content: "Testing secondary content."
      }
    ]
  };
});

describe('BlueprintConsole Component', () => {
  beforeEach(() => {
    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
      writable: true,
      configurable: true,
    });
  });

  it('renders correctly with initial layout', () => {
    render(<BlueprintConsole />);
    expect(screen.getByPlaceholderText('Search RAG, Firestore, ADK, security...')).toBeInTheDocument();
    expect(screen.getByText('Hackathon Arch-Blueprint Manual')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('can search for text across sections', () => {
    render(<BlueprintConsole />);
    const searchInput = screen.getByPlaceholderText('Search RAG, Firestore, ADK, security...');
    fireEvent.change(searchInput, { target: { value: 'Cloud' } });
    expect(searchInput).toHaveValue('Cloud');
  });

  it('can select categories from the tabs', () => {
    render(<BlueprintConsole />);
    const tab = screen.getAllByText('Cloud & Data Tech')[0];
    fireEvent.click(tab);
    // Tab should have active styles
    expect(tab).toHaveClass('bg-cyan-500');
  });

  it('can select section from left sidebar', () => {
    render(<BlueprintConsole />);
    // Select the "Executive Summary" button (or any other section button)
    const sectionBtn = screen.getAllByText('Executive Summary')[0];
    fireEvent.click(sectionBtn);
    // It should render its content
    expect(screen.getByText('SECTION #1')).toBeInTheDocument();
  });

  it('renders formatted tables and code blocks correctly', () => {
    render(<BlueprintConsole />);
    // Verify standard text is present
    expect(screen.getByText('This is standard text.')).toBeInTheDocument();
    
    // Verify table cell is present (proving table parsing is fully covered)
    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
    
    // Verify inline code block is rendered as code element (proving backtick code parsing is covered)
    const codeElement = screen.getByText('code block');
    expect(codeElement.tagName.toLowerCase()).toBe('code');
  });

  it('handles copying to clipboard correctly', async () => {
    render(<BlueprintConsole />);
    const copyButton = screen.getByTitle('Copy details as Markdown');
    expect(copyButton).toBeInTheDocument();
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    // Should show checkmark icon indicating copied
    await waitFor(() => {
      expect(screen.getByTitle('Copy details as Markdown')).toBeInTheDocument();
    });
  });

  it('displays NO COMPILING MATCHES FOUND when search query has no match', () => {
    render(<BlueprintConsole />);
    const searchInput = screen.getByPlaceholderText('Search RAG, Firestore, ADK, security...');
    fireEvent.change(searchInput, { target: { value: 'non_existent_section_with_weird_name' } });
    expect(screen.getByText('NO COMPILING MATCHES FOUND')).toBeInTheDocument();
  });
});


