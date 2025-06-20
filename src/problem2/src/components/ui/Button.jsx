/**
 * Reusable Button Component
 * UI layer - Presentation component
 */

/* eslint-disable react/prop-types */

import { Loader2 } from 'lucide-react';

/**
 * Button component with multiple variants and sizes
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'ghost'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.isLoading - Whether button is in loading state
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type (button, submit, reset)
 * @returns {JSX.Element} Button component
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    isLoading = false,
    className = '',
    onClick = () => { },
    type = 'button',
    ...props
}) => {
    // Base button styles
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant styles
    const variantStyles = {
        primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 focus:ring-gray-500',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    };

    // Size styles
    const sizeStyles = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    // Combine all styles
    const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim();

    /**
     * Handle button click
     * @param {Event} event - Click event
     */
    const handleClick = (event) => {
        if (disabled || isLoading) {
            event.preventDefault();
            return;
        }
        onClick(event);
    };

    return (
        <button
            type={type}
            className={buttonStyles}
            disabled={disabled || isLoading}
            onClick={handleClick}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default Button; 