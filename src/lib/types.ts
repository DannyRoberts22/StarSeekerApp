import { z } from 'zod';

export const LinkSchema = z.object({
  hu: z.string(), // Hyperspace Units or similar
  code: z.string(), // Gate code
});
export type Link = z.infer<typeof LinkSchema>;

export const GateSchema = z.object({
  uuid: z.string().optional(),
  code: z.string(),
  name: z.string(),
  links: z.array(LinkSchema).nullable().optional(),
  createdAt: z.number(),
  updatedAt: z.string().nullable().optional(),
});
export type Gate = z.infer<typeof GateSchema>;

export const TransportCostSchema = z.object({
  currency: z.string(),
  journeyCost: z.number(),
  parkingFee: z.number(),
  recommendedTransport: z.object({
    capacity: z.number(),
    name: z.string(),
    ratePerAu: z.number(),
  }),
});
export type TransportCost = z.infer<typeof TransportCostSchema>;

export const JourneySchema = z.object({
  from: GateSchema,
  to: GateSchema,
  route: z.array(z.string()),
  totalCost: z.number(),
});
export type Journey = z.infer<typeof JourneySchema>;

export const StatusSchema = z.object({
  db: z.object({
    canConnect: z.boolean(),
    hasRequiredTableAccess: z.boolean(),
  }),
  version: z.string(),
});
export type Status = z.infer<typeof StatusSchema>;

// Theme constants
export const LIGHT = 'light' as const;
export const DARK = 'dark' as const;

export type ColorScheme = typeof LIGHT | typeof DARK;
