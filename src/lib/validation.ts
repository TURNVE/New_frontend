import { z } from 'zod';

export const ClientInviteSchema = z.object({
  emails: z.array(z.string().email()).max(50),
  simulationIds: z.array(z.string().uuid()).optional(),
  message: z.string().max(500).optional(),
});

export const SearchFilterSchema = z.object({
  search: z.string().max(200).optional(),
  status: z.string().optional(),
  type: z.string().optional(),
});

export const SimulationConfigSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  startDate: z.string(),
  durationWeeks: z.number().min(1).max(52),
});

export const UserProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional(),
  skills: z.array(z.string().max(50)).max(20).optional(),
});
