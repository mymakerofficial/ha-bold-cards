import z from "zod";

export const baseCardConfigStruct = z.object({
  type: z.string(),
  view_layout: z.any(),
  layout_options: z.any(),
  grid_options: z.any(),
  visibility: z.any(),
});
