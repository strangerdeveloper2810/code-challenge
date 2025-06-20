/**
 * Problem 1: Three ways to sum to n
 *
 * This file contains three different implementations to calculate the sum of integers from 1 to n.
 * Each solution demonstrates a different algorithmic approach with varying time and space complexities.
 */

/**
 * Solution A: Mathematical Formula Approach
 *
 * This is the most optimal solution using the arithmetic series formula.
 * Formula: sum = n * (n + 1) / 2
 *
 * Time Complexity: O(1) - constant time
 * Space Complexity: O(1) - constant space
 *
 * @param {number} n - The upper limit integer to sum to
 * @returns {number} The sum of integers from 1 to n
 */
const sum_to_n_a = (n) => {
  // Using arithmetic series formula for instant calculation
  return (n * (n + 1)) / 2;
};

/**
 * Solution B: Iterative Approach
 *
 * This solution uses a simple for loop to accumulate the sum.
 * It's straightforward and memory-efficient but slower for large numbers.
 *
 * Time Complexity: O(n) - linear time
 * Space Complexity: O(1) - constant space
 *
 * @param {number} n - The upper limit integer to sum to
 * @returns {number} The sum of integers from 1 to n
 */
const sum_to_n_b = (n) => {
  let sum = 0;

  // Iterate through all numbers from 1 to n and accumulate the sum
  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
};

/**
 * Solution C: Recursive Approach
 *
 * This solution uses recursion to break down the problem into smaller subproblems.
 * It's elegant and demonstrates functional programming concepts but uses more memory.
 *
 * Time Complexity: O(n) - linear time
 * Space Complexity: O(n) - linear space (due to call stack)
 *
 * @param {number} n - The upper limit integer to sum to
 * @returns {number} The sum of integers from 1 to n
 */
const sum_to_n_c = (n) => {
  // Base case: if n is 0 or 1, return n directly
  if (n <= 1) {
    return n;
  }

  // Recursive case: current number + sum of all previous numbers
  return n + sum_to_n_c(n - 1);
};

/**
 * Export all three functions for external use
 * This allows other modules to import and use these functions
 */
module.exports = {
  sum_to_n_a,
  sum_to_n_b,
  sum_to_n_c,
};

/**
 * Test Suite and Performance Comparison
 *
 * This section runs automatically when the file is executed directly (not imported).
 * It tests all three solutions and compares their performance.
 */
if (require.main === module) {
  console.log("🧮 Testing sum_to_n functions with different approaches:\n");

  // Test Case 1: Small number (n = 5)
  console.log("📊 Test Case 1: n = 5 (Expected result: 15)");
  console.log(`Mathematical Formula: ${sum_to_n_a(5)}`);
  console.log(`Iterative Approach: ${sum_to_n_b(5)}`);
  console.log(`Recursive Approach: ${sum_to_n_c(5)}\n`);

  // Test Case 2: Medium number (n = 10)
  console.log("📊 Test Case 2: n = 10 (Expected result: 55)");
  console.log(`Mathematical Formula: ${sum_to_n_a(10)}`);
  console.log(`Iterative Approach: ${sum_to_n_b(10)}`);
  console.log(`Recursive Approach: ${sum_to_n_c(10)}\n`);

  // Performance comparison with larger number
  const testNumber = 1000;
  console.log(`⚡ Performance Comparison with n = ${testNumber}:\n`);

  // Test Solution A - Mathematical Formula
  console.time("🏆 Mathematical Formula (Most Optimal)");
  const resultA = sum_to_n_a(testNumber);
  console.timeEnd("🏆 Mathematical Formula (Most Optimal)");

  // Test Solution B - Iterative Approach
  console.time("🔄 Iterative Approach");
  const resultB = sum_to_n_b(testNumber);
  console.timeEnd("🔄 Iterative Approach");

  // Test Solution C - Recursive Approach
  console.time("🔁 Recursive Approach");
  const resultC = sum_to_n_c(testNumber);
  console.timeEnd("🔁 Recursive Approach");

  // Verify all solutions produce the same result
  const allMatch = resultA === resultB && resultB === resultC;
  console.log(`\n✅ All results match: ${allMatch ? "YES" : "NO"}`);
  console.log(`Final result: ${resultA}`);

  // Summary and recommendations
  console.log(`\n📝 Summary:`);
  console.log(`• Mathematical Formula: Fastest, most efficient (O(1) time)`);
  console.log(`• Iterative Approach: Simple, memory-efficient (O(n) time)`);
  console.log(
    `• Recursive Approach: Elegant but uses more memory (O(n) space)`
  );
  console.log(
    `\n🎯 Recommendation: Use Mathematical Formula for production code!`
  );
}
