/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ENABLE_PATIENT_STREAM?: string  //是否启用病人对话流式接口，支持以下任意一种方式启用：1、true、yes、on（不区分大小写）。默认为false，即不启用流式接口。
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
