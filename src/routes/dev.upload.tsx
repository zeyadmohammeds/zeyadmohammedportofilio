import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { JsonView } from "@/components/json-view";
import { useRef, useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  FileWarning,
  ImageIcon,
  Loader2,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";

export const Route = createFileRoute("/dev/upload")({
  head: () => ({
    meta: [
      { title: "Upload Lab - Zeyad Mohammed" },
      { name: "description", content: "Advanced upload demo with validation, preview, and response payload display." },
    ],
  }),
  component: UploadDemo,
});

const maxBytes = 5 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function UploadDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [response, setResponse] = useState<{ status: number; statusText: string; ms: number; body: unknown } | null>(null);
  const [uploading, setUploading] = useState(false);

  function setPickedFile(nextFile: File | null) {
    setValidationError(null);
    setResponse(null);

    if (!nextFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    if (!nextFile.type.startsWith("image/")) {
      setValidationError(`Only image files are supported. Received: ${nextFile.type || "unknown"}`);
      return;
    }

    if (nextFile.size > maxBytes) {
      setValidationError(`File size is ${formatBytes(nextFile.size)}. Maximum allowed is 5 MB.`);
      return;
    }

    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setPickedFile(event.target.files?.[0] ?? null);
  }

  async function upload() {
    if (!file) return;
    setUploading(true);
    try {
      const started = performance.now();
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://zeyadportfolio.runasp.net";
      const fetchResponse = await fetch(`${apiBaseUrl}/api/v1/uploads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, type: file.type }),
      });
      const text = await fetchResponse.text();
      let body: unknown = text;
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = text;
      }

      setResponse({
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        ms: Math.round(performance.now() - started),
        body,
      });
    } catch (error) {
      setResponse({
        status: 0,
        statusText: "Network Error",
        ms: 0,
        body: (error as Error).message,
      });
    } finally {
      setUploading(false);
    }
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
    setResponse(null);
    setValidationError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <PageShell>
      <div className="page-enter mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <section className="section-shell mt-4 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="editorial-kicker">Upload lab</p>
              <h1 className="mt-4 font-display text-5xl font-black leading-[0.92] md:text-7xl">
                File validation now feels like part of the product.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
                This lab keeps the real upload endpoint behavior while giving the page a much more advanced and polished interface.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: "5 MB", label: "Limit" },
                { value: "Image", label: "Accepted" },
                { value: "JSON", label: "Response" },
              ].map((item) => (
                <div key={item.label} className="showcase-card px-5 py-5">
                  <div className="text-2xl font-black">{item.value}</div>
                  <div className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="section-shell p-5 md:p-6">
            <label className="block">
              <div className="showcase-card flex min-h-[28rem] cursor-pointer flex-col items-center justify-center px-6 py-8 text-center">
                <AnimatePresence mode="wait">
                  {preview ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="w-full"
                    >
                      <div className="relative mx-auto max-w-md overflow-hidden rounded-[1.8rem] bg-card">
                        <img src={preview} alt="Upload preview" className="h-[22rem] w-full object-cover" />
                        <button
                          type="button"
                          onClick={clearFile}
                          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-background/85"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-5 text-sm font-bold">{file?.name}</div>
                      <div className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">
                        {formatBytes(file?.size ?? 0)} • {file?.type}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UploadCloud className="h-8 w-8" />
                      </div>
                      <h2 className="mt-6 font-display text-3xl font-black">Drop an image or browse files</h2>
                      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                        The visual layer is cleaner now, but the validation rules are still strict and connected to the real upload flow.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} className="hidden" />
            </label>

            {validationError && (
              <div className="mt-5 rounded-[1.4rem] border border-destructive/20 bg-destructive/10 px-5 py-4 text-sm text-destructive">
                <div className="flex items-center gap-3">
                  <FileWarning className="h-5 w-5" />
                  {validationError}
                </div>
              </div>
            )}

            <button
              onClick={upload}
              disabled={!file || uploading}
              className="mt-5 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              {uploading ? "Uploading" : "Run Upload Test"}
            </button>
          </div>

          <div className="grid gap-6">
            <div className="section-shell p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="editorial-kicker">Response</p>
                  <h2 className="mt-3 font-display text-3xl font-black">Server payload</h2>
                </div>
                {response && (
                  <div className="rounded-full bg-primary/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">
                    {response.status} • {response.ms}ms
                  </div>
                )}
              </div>
              <div className="mt-5 min-h-[22rem] rounded-[1.6rem] border border-foreground/10 bg-[#151311] p-4 text-white">
                {response ? (
                  <JsonView data={response.body} />
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-white/70">
                    <div>
                      <ImageIcon className="mx-auto h-10 w-10" />
                      <p className="mt-4">Pick a file and run the upload test to inspect the response here.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="section-shell p-5 md:p-6">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">
                <ShieldCheck className="h-4 w-4" />
                Validation notes
              </div>
              <div className="mt-4 grid gap-4">
                <div className="showcase-card px-5 py-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <p className="text-sm leading-7 text-muted-foreground">Image mime type is validated before the request is sent.</p>
                  </div>
                </div>
                <div className="showcase-card px-5 py-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <p className="text-sm leading-7 text-muted-foreground">Oversized files are blocked with a clearer UI message.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
