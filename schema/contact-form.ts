"use client"

import { z } from "zod"

export const contactSchema = z.object({
  phone:z.string().min(11,"Please a valid Phone number"),
  firstName:z.string(),
  lastName:z.string(),
  email:z.string().email("Please enter a valid email"),
  hasWhatsApp:z.boolean().default(true),
  blockedCampaigns:z.boolean().default(false), 
  blockedFromBot:z.boolean().default(false),
  blockedFromCC:z.boolean().default(false),
})
