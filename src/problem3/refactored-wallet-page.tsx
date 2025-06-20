/**
 * REFACTORED VERSION - Problem 3
 * Fixed all computational inefficiencies and anti-patterns
 */

import { FC, useMemo, useCallback } from "react";

// ✅ Fixed: Added missing blockchain property and proper typing
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain; // ✅ Proper typing instead of 'any'
}

// ✅ Added: Proper type for formatted balance
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

// ✅ Added: Enum for blockchain types (better than magic strings)
enum Blockchain {
  OSMOSIS = "Osmosis",
  ETHEREUM = "Ethereum",
  ARBITRUM = "Arbitrum",
  ZILLIQA = "Zilliqa",
  NEO = "Neo",
}

// ✅ Added: Proper Props interface with actual properties
interface WalletPageProps extends BoxProps {
  className?: string;
}

const WalletPage: FC<WalletPageProps> = ({ children, className, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // ✅ Fixed: Memoized priority function with proper typing
  const getPriority = useCallback((blockchain: Blockchain): number => {
    const priorityMap: Record<Blockchain, number> = {
      [Blockchain.OSMOSIS]: 100,
      [Blockchain.ETHEREUM]: 50,
      [Blockchain.ARBITRUM]: 30,
      [Blockchain.ZILLIQA]: 20,
      [Blockchain.NEO]: 20,
    };

    return priorityMap[blockchain] ?? -99; // ✅ Default value using nullish coalescing
  }, []);

  // ✅ Fixed: Proper filtering logic and complete sorting
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // ✅ Fixed: Only include positive amounts with valid priority
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        // ✅ Fixed: Complete sort comparison
        if (leftPriority !== rightPriority) {
          return rightPriority - leftPriority; // Descending order
        }

        // ✅ Added: Secondary sort by amount when priorities are equal
        return rhs.amount - lhs.amount;
      });
  }, [balances, getPriority]); // ✅ Fixed: Removed unused 'prices' dependency

  // ✅ Fixed: Memoized formatted balances with proper typing
  const formattedBalances = useMemo((): FormattedWalletBalance[] => {
    return sortedBalances.map((balance: WalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2), // ✅ Added decimal places
      usdValue: (prices[balance.currency] || 0) * balance.amount, // ✅ Moved calculation here
    }));
  }, [sortedBalances, prices]);

  // ✅ Fixed: Proper mapping with unique keys and correct types
  const walletRows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance) => (
      <WalletRow
        key={`${balance.currency}-${balance.blockchain}`} // ✅ Unique key instead of index
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
        currency={balance.currency}
        blockchain={balance.blockchain}
      />
    ));
  }, [formattedBalances]);

  return (
    <div className={className} {...rest}>
      {walletRows}
      {children}
    </div>
  );
};

// ✅ Added: Export the component and types
export default WalletPage;
export type { WalletPageProps, WalletBalance, FormattedWalletBalance };
export { Blockchain };
