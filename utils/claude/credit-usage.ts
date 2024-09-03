// Constants for conversion rates
const DOLLARS_TO_CREDITS = 200; // 1$ = 200 credits
const INPUT_COST_PER_MTOK = 3; // $3 per million input tokens
const OUTPUT_COST_PER_MTOK = 15; // $15 per million output tokens

interface TokenCounts {
  input: number;
  output: number;
}

export function calculateCreditValue(tokens: TokenCounts): number {
  // Calculate cost in dollars
  const inputCost = (tokens.input / 1_000_000) * INPUT_COST_PER_MTOK;
  const outputCost = (tokens.output / 1_000_000) * OUTPUT_COST_PER_MTOK;
  const totalCost = inputCost + outputCost;

  // Convert dollars to credits and round to the nearest integer
  return Math.round(totalCost * DOLLARS_TO_CREDITS);
}
