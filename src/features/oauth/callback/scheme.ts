import { z } from "zod"

const callbackOAuthScheme = z.object({
  code: z.string(),
  state: z.string(),
})

export { callbackOAuthScheme }
