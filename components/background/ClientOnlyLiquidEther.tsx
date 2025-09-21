'use client';

import dynamic from 'next/dynamic';

// Dynamically import the LiquidEther component with SSR turned off
const DynamicLiquidEther = dynamic(
  () => import('@/components/background/LiquidEther'),
  { ssr: false }
);

/**
 * This is a client-side-only wrapper component for LiquidEther.
 * It safely renders the component only in the browser, preventing SSR errors.
 * It passes all received props down to the original LiquidEther component.
 */
export default function ClientOnlyLiquidEther(props: any) {
  return <DynamicLiquidEther {...props} />;
}
