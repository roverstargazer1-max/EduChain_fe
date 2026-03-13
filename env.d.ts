/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ENABLE_PATIENT_STREAM?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
