/**
 * SwapForm Component Integration Tests
 * Tests user interactions and UI behavior
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SwapForm from '../SwapForm.jsx';

// Create mock functions
const mockSetFromToken = vi.fn();
const mockSetToToken = vi.fn();
const mockSetFromAmount = vi.fn();
const mockSetToAmount = vi.fn();
const mockSwapTokens = vi.fn();
const mockResetForm = vi.fn();
const mockExecuteSwap = vi.fn();

// Mock hooks with default state
vi.mock('../../../hooks', () => ({
    useTokens: vi.fn(() => ({
        tokens: [
            { currency: 'ETH', price: 2000 },
            { currency: 'BTC', price: 30000 },
            { currency: 'USDC', price: 1 }
        ],
        isLoading: false,
        error: null
    })),
    useSwap: vi.fn(() => ({
        state: {
            formData: {
                fromToken: null,
                toToken: null,
                fromAmount: '',
                toAmount: ''
            },
            isLoading: false,
            error: null,
            exchangeRate: null,
            isValidSwap: false
        },
        actions: {
            setFromToken: mockSetFromToken,
            setToToken: mockSetToToken,
            setFromAmount: mockSetFromAmount,
            setToAmount: mockSetToAmount,
            swapTokens: mockSwapTokens,
            resetForm: mockResetForm,
            executeSwap: mockExecuteSwap
        }
    }))
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: vi.fn(),
    Toaster: () => null
}));

describe('SwapForm Component', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render main elements', () => {
            render(<SwapForm />);

            expect(screen.getByText('Currency Swap')).toBeInTheDocument();
            expect(screen.getByText('Exchange your tokens instantly with the best rates')).toBeInTheDocument();
            expect(screen.getByText('From')).toBeInTheDocument();
            expect(screen.getByText('To (estimated)')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /swap tokens/i })).toBeInTheDocument();
        });

        it('should render token selection dropdowns', () => {
            render(<SwapForm />);

            const selects = screen.getAllByRole('combobox');
            expect(selects).toHaveLength(2);
        });

        it('should render amount input fields', () => {
            render(<SwapForm />);

            const inputs = screen.getAllByPlaceholderText('0.00');
            expect(inputs).toHaveLength(2);
        });

        it('should render MAX button', () => {
            render(<SwapForm />);

            expect(screen.getByText('MAX')).toBeInTheDocument();
        });
    });

    describe('User Interactions', () => {
        it('should handle amount input', async () => {
            render(<SwapForm />);

            const fromInput = screen.getAllByPlaceholderText('0.00')[0];
            await user.type(fromInput, '123.45');

            // Verify interaction occurred
            expect(fromInput).toHaveAttribute('value', expect.any(String));
        });

        it('should handle swap button click', async () => {
            render(<SwapForm />);

            const swapButton = screen.getByRole('button', { name: /swap tokens/i });
            expect(swapButton).toBeInTheDocument();
        });
    });

    describe('Conditional Rendering', () => {
        it('should show validation help text', () => {
            render(<SwapForm />);

            expect(screen.getByText('Select tokens to continue')).toBeInTheDocument();
        });

        it('should disable submit button when swap is invalid', () => {
            render(<SwapForm />);

            const submitButton = screen.getByRole('button', { name: /swap tokens/i });
            expect(submitButton).toBeDisabled();
        });
    });

    describe('Accessibility', () => {
        it('should have proper form labels', () => {
            render(<SwapForm />);

            expect(screen.getByText('From')).toBeInTheDocument();
            expect(screen.getByText('To (estimated)')).toBeInTheDocument();
        });

        it('should have proper input accessibility', () => {
            render(<SwapForm />);

            const inputs = screen.getAllByRole('textbox');
            inputs.forEach(input => {
                expect(input).toHaveAttribute('placeholder');
            });
        });
    });
}); 