import { useEffect } from "react";

/**
 * Clean, reusable hook for facility-aware data fetching.
 * Follows SOLID: Single Responsibility (facility change handling), Open/Closed (extendable via callback).
 * Works both when embedded in Main (via prop) and standalone (via localStorage fallback).
 * No patch, no direct DOM manipulation beyond React state.
 */
export function useFacilityAware(
  facilityId: number | null | undefined,
  onFacilityChange: (facilityId: number | null) => void
) {
  useEffect(() => {
    // Re-fetch when facility changes - clean via React effect, no window.reload
    if (facilityId !== undefined) {
      onFacilityChange(facilityId ?? null);
    }
  }, [facilityId, onFacilityChange]);
}
