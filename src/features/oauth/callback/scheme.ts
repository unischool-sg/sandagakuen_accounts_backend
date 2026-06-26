import { z } from "zod"

const callbackOAuthScheme = z.object({
  code: z.string(),
  state: z.string(),
})

type CallbackOAuthScheme = z.infer<typeof callbackOAuthScheme>

export { callbackOAuthScheme }
export type { CallbackOAuthScheme }
