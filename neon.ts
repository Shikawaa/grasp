import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  buckets: {
    pdfs: { access: "private" },
    audio: { access: "public_read" },
  },
});
