/**
 * MSW client worker for browser development environments.
 * Dynamically loaded in the browser ONLY when NEXT_PUBLIC_ENABLE_MSW === 'true'.
 * Prevents MSW browser bundle execution during Next.js SSR/prerender.
 */
export async function initMswBrowser(): Promise<void> {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_ENABLE_MSW === "true") {
    const { setupWorker } = await import("msw/browser");
    const { handlers } = await import("./handlers");
    const worker = setupWorker(...handlers);
    await worker.start({
      onUnhandledRequest: "bypass",
    });
  }
}
