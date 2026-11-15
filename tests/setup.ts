import "@testing-library/jest-dom";
import { server } from "@/mocks/server";

// Mock IntersectionObserver for JSDOM
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect = jest.fn();
  observe = jest.fn();
  takeRecords = jest.fn().mockReturnValue([]);
  unobserve = jest.fn();
}

if (typeof window !== "undefined") {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}
Object.defineProperty(global, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Establish API mocking before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

// Reset any runtime request handlers added in specific tests
afterEach(() => {
  server.resetHandlers();
});

// Clean up after the tests are finished
afterAll(() => {
  server.close();
});
