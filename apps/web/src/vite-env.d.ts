/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public API base URL (non-secret). Empty/undefined = same origin via dev proxy. */
  readonly VITE_API_BASE_URL?: string
  /** Public IDs for a prepared local presentation application. */
  readonly VITE_PRESENTATION_QUESTION_SET_ID?: string
  readonly VITE_PRESENTATION_QUESTION_ID?: string
}
