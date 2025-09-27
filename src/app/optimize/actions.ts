'use server';

import { optimizeDeliveryRoute, type OptimizeDeliveryRouteInput, type OptimizeDeliveryRouteOutput } from '@/ai/flows/optimize-delivery-route';

export async function getOptimizedRoute(input: OptimizeDeliveryRouteInput): Promise<OptimizeDeliveryRouteOutput> {
  try {
    const result = await optimizeDeliveryRoute(input);
    if (!result || !result.optimizedRoute) {
        throw new Error('AI did not return a valid route.');
    }
    return result;
  } catch (error) {
    console.error("Error in getOptimizedRoute server action: ", error);
    throw new Error("Failed to optimize route.");
  }
}
