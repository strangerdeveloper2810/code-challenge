/**
 * SwapForm Component - Main currency swap interface
 * Presentation layer
 */

import { useSwap, useTokens } from '../../hooks';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronDown, ArrowUpDown, Loader2, TrendingUp, Coins } from 'lucide-react';
import {
    formatPrice,
    formatCryptoAmount,
    formatExchangeRate,
    calculateUSDValue
} from '../../utils/currency';
import { Button } from '../ui';

/**
 * TokenOption Component - Display token with icon in dropdown
 * @param {Object} token - Token object
 * @param {boolean} isSelected - Whether token is selected
 * @returns {JSX.Element} Token option with icon
 */
const TokenOption = ({ token, isSelected = false }) => {
    return (
        <div className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
            <div className="w-8 h-8 relative flex-shrink-0">
                <img
                    src={token.iconUrl}
                    alt={token.currency}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                        // Fallback to gradient avatar if icon fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                <div className="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ display: 'none' }}>
                    {token.currency.charAt(0)}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{token.currency}</span>
                    <span className="text-sm text-gray-500">{formatPrice(token.price, 'USD', true)}</span>
                </div>
            </div>
        </div>
    );
};

/**
 * Main swap form component
 * @returns {JSX.Element} Swap form interface
 */
const SwapForm = () => {
    const { tokens, isLoading: tokensLoading, error: tokensError } = useTokens();
    const { state, actions } = useSwap(tokens);

    // Early returns for loading and error states
    if (tokensLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="flex items-center gap-3 text-indigo-600">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-lg font-medium">Loading tokens...</span>
                </div>
            </div>
        );
    }

    if (tokensError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Tokens</h2>
                    <p className="text-gray-600">{tokensError}</p>
                </div>
            </div>
        );
    }

    /**
     * Handle token selection for from token
     * @param {Object} token - Selected token object
     */
    const handleFromTokenChange = (token = null) => actions.setFromToken(token);

    /**
     * Handle token selection for to token
     * @param {Object} token - Selected token object
     */
    const handleToTokenChange = (token = null) => actions.setToToken(token);

    /**
     * Handle from amount input change
     * @param {Event} event - Input change event
     */
    const handleFromAmountChange = (event = {}) => actions.setFromAmount(event.target?.value || '');

    /**
     * Handle to amount input change
     * @param {Event} event - Input change event
     */
    const handleToAmountChange = (event = {}) => actions.setToAmount(event.target?.value || '');

    /**
     * Handle swap tokens button click
     */
    const handleSwapTokens = () => actions.swapTokens();

    /**
     * Handle form submit
     * @param {Event} event - Form submit event
     */
    const handleSubmit = (event = {}) => {
        event.preventDefault?.();
        actions.executeSwap()
    };

    /**
     * Handle max button click
     */
    const handleMaxClick = () => {
        // Simulate getting max balance (in real app, this would come from wallet)
        const maxBalance = '1000';
        actions.setFromAmount(maxBalance);

        const formattedAmount = formatCryptoAmount(
            maxBalance,
            state.formData.fromToken?.currency || '',
            true
        );

        toast(`💰 Max amount set: ${formattedAmount}`, {
            duration: 2000,
            position: 'top-right',
        });
    };

    return (
        <>
            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    // Define default options
                    className: '',
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        borderRadius: '8px',
                        fontWeight: 500,
                    },
                    // Default options for specific types
                    success: {
                        duration: 3000,
                        style: {
                            background: '#10b981',
                            color: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: '#ef4444',
                            color: '#fff',
                        },
                    },
                }}
            />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
                                <Coins className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Currency Swap
                            </h1>
                        </div>
                        <p className="text-gray-500">Exchange your tokens instantly with the best rates</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* From Token Section */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-700">
                                    From
                                </label>
                                <button
                                    type="button"
                                    onClick={handleMaxClick}
                                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded-md transition-colors font-medium"
                                    disabled={!state.formData.fromToken}
                                >
                                    MAX
                                </button>
                            </div>

                            <div className="flex gap-3 mb-4 relative">
                                <div className="flex-1 relative">
                                    <select
                                        value={state.formData.fromToken?.currency || ''}
                                        onChange={(e) => {
                                            const token = tokens.find(t => t.currency === e.target.value);
                                            if (token) handleFromTokenChange(token);
                                        }}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-all hover:border-gray-300 font-medium"
                                    >
                                        <option value="">Select token</option>
                                        {tokens.map((token) => (
                                            <option key={token.currency} value={token.currency}>
                                                {token.currency} - {formatPrice(token.price, 'USD', true)}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Selected token icon */}
                                    {state.formData.fromToken && (
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6">
                                            <img
                                                src={state.formData.fromToken.iconUrl}
                                                alt={state.formData.fromToken.currency}
                                                className="w-full h-full rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ display: 'none' }}>
                                                {state.formData.fromToken.currency.charAt(0)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Dropdown arrow */}
                                    <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="0.00"
                                    value={state.formData.fromAmount}
                                    onChange={handleFromAmountChange}
                                    className="w-full bg-transparent text-3xl font-bold placeholder-gray-300 border-none outline-none focus:placeholder-gray-400 transition-colors"
                                />
                                {state.formData.fromAmount && (
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                                        <TrendingUp className="h-5 w-5 text-green-500" />
                                    </div>
                                )}
                            </div>

                            {state.formData.fromToken && (
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 relative">
                                            <img
                                                src={state.formData.fromToken.iconUrl}
                                                alt={state.formData.fromToken.currency}
                                                className="w-full h-full rounded-full object-cover"
                                                onError={(e) => {
                                                    // Fallback to gradient avatar if icon fails to load
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ display: 'none' }}>
                                                {state.formData.fromToken.currency.charAt(0)}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {formatPrice(state.formData.fromToken.price)}
                                        </p>
                                    </div>
                                    {state.formData.fromAmount && (
                                        <p className="text-sm font-medium text-gray-700">
                                            ≈ {calculateUSDValue(state.formData.fromAmount, state.formData.fromToken.price)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Swap Button */}
                        <div className="flex justify-center py-2">
                            <button
                                type="button"
                                onClick={handleSwapTokens}
                                className="bg-blue-100 hover:bg-blue-200 p-4 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl group"
                                disabled={state.isLoading}
                            >
                                <ArrowUpDown className="h-6 w-6 text-blue-600 group-hover:rotate-180 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* To Token Section */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-gray-200 hover:border-indigo-300 transition-colors">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                To (estimated)
                            </label>

                            <div className="flex gap-3 mb-4 relative">
                                <div className="flex-1 relative">
                                    <select
                                        value={state.formData.toToken?.currency || ''}
                                        onChange={(e) => {
                                            const token = tokens.find(t => t.currency === e.target.value);
                                            if (token) handleToTokenChange(token);
                                        }}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer transition-all hover:border-gray-300 font-medium"
                                    >
                                        <option value="">Select token</option>
                                        {tokens.map((token) => (
                                            <option key={token.currency} value={token.currency}>
                                                {token.currency} - {formatPrice(token.price, 'USD', true)}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Selected token icon */}
                                    {state.formData.toToken && (
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6">
                                            <img
                                                src={state.formData.toToken.iconUrl}
                                                alt={state.formData.toToken.currency}
                                                className="w-full h-full rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="w-full h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ display: 'none' }}>
                                                {state.formData.toToken.currency.charAt(0)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Dropdown arrow */}
                                    <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="0.00"
                                    value={formatCryptoAmount(state.formData.toAmount, '', false)}
                                    onChange={handleToAmountChange}
                                    className="w-full bg-transparent text-3xl font-bold placeholder-gray-300 border-none outline-none focus:placeholder-gray-400 transition-colors text-indigo-600"
                                    readOnly
                                />
                                {state.formData.toAmount && parseFloat(state.formData.toAmount) > 0 && (
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                                        <div className="animate-pulse">
                                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {state.formData.toToken && (
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 relative">
                                            <img
                                                src={state.formData.toToken.iconUrl}
                                                alt={state.formData.toToken.currency}
                                                className="w-full h-full rounded-full object-cover"
                                                onError={(e) => {
                                                    // Fallback to gradient avatar if icon fails to load
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="w-full h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ display: 'none' }}>
                                                {state.formData.toToken.currency.charAt(0)}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {formatPrice(state.formData.toToken.price)}
                                        </p>
                                    </div>
                                    {state.formData.toAmount && (
                                        <p className="text-sm font-medium text-indigo-700">
                                            ≈ {calculateUSDValue(state.formData.toAmount, state.formData.toToken.price)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Exchange Rate */}
                        {state.exchangeRate && state.formData.fromToken && state.formData.toToken && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-200">
                                <p className="text-sm text-blue-600 font-medium">
                                    {formatExchangeRate(
                                        state.exchangeRate,
                                        state.formData.fromToken.currency,
                                        state.formData.toToken.currency
                                    )}
                                </p>
                                <p className="text-xs text-blue-500 mt-1 flex items-center justify-center gap-1">
                                    <div className="h-1 w-1 bg-green-400 rounded-full animate-pulse"></div>
                                    Best rate • Updated in real-time
                                </p>
                            </div>
                        )}

                        {/* Error Display */}
                        {state.error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
                                <p className="text-red-600 text-sm font-medium">{state.error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={!state.isValidSwap || state.isLoading}
                            className="w-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            isLoading={state.isLoading}
                        >
                            {state.isLoading ? 'Processing Swap...' : 'Swap Tokens'}
                        </Button>

                        {/* Validation Help */}
                        {!state.isValidSwap && !state.error && (
                            <div className="text-center">
                                <p className="text-xs text-gray-400">
                                    {!state.formData.fromToken || !state.formData.toToken
                                        ? 'Select tokens to continue'
                                        : 'Enter an amount to swap'
                                    }
                                </p>
                            </div>
                        )}
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-6 text-xs text-gray-400">
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex items-center gap-1">
                                <div className="h-1 w-1 bg-green-400 rounded-full animate-pulse"></div>
                                <span>Real-time rates</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-1 w-1 bg-blue-400 rounded-full animate-pulse"></div>
                                <span>Secure swaps</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-1 w-1 bg-purple-400 rounded-full animate-pulse"></div>
                                <span>Low fees</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SwapForm; 