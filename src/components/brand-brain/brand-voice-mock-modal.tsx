"use client";

import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { BrandBrainDialog } from "@/components/brand-brain/brand-brain-dialog";
import type { BrandVoice } from "@/lib/brand-brain/types";

const titleLimit = 80;
const descriptionLimit = 400;
const traitLimit = 30;
const maximumTraits = 6;

export function BrandVoiceMockModal({
  onClose,
  onSave,
  voice,
}: {
  onClose: () => void;
  onSave: (voice: BrandVoice) => void;
  voice: BrandVoice;
}) {
  const [draft, setDraft] = useState<BrandVoice>(() => ({ ...voice, traits: [...voice.traits] }));
  const [traitInput, setTraitInput] = useState("");
  const [traitError, setTraitError] = useState("");

  const errors = useMemo(() => validateVoice(draft), [draft]);
  const isValid = Object.values(errors).every((error) => !error);

  function update<K extends keyof BrandVoice>(key: K, value: BrandVoice[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function addTrait() {
    const trait = traitInput.trim().replace(/^#+/, "").trim();
    if (!trait) return setTraitError("Enter a trait before adding it.");
    if (trait.length > traitLimit) return setTraitError(`Traits can contain up to ${traitLimit} characters.`);
    if (draft.traits.length >= maximumTraits) return setTraitError(`You can add up to ${maximumTraits} traits.`);
    if (draft.traits.some((item) => item.toLocaleLowerCase() === trait.toLocaleLowerCase())) {
      return setTraitError("This trait has already been added.");
    }
    update("traits", [...draft.traits, trait]);
    setTraitInput("");
    setTraitError("");
  }

  function handleTraitKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addTrait();
  }

  function removeTrait(trait: string) {
    update("traits", draft.traits.filter((item) => item !== trait));
    setTraitError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;
    onSave({ ...draft, traits: [...draft.traits] });
  }

  return (
    <BrandBrainDialog
      title="Edit Brand Voice"
      description="Refine how your brand communicates."
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="h-11 rounded-lg border border-[#c5d2e5] bg-white px-5 text-sm font-bold text-[#414755] transition hover:bg-[#eff4ff] focus:outline-none focus:ring-2 focus:ring-[#78aef5]">
            Cancel
          </button>
          <button type="submit" form="brand-voice-form" disabled={!isValid} className="h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white transition hover:bg-[#004493] focus:outline-none focus:ring-2 focus:ring-[#78aef5] disabled:cursor-not-allowed disabled:bg-[#aab8ca]">
            Save Changes
          </button>
        </>
      }
    >
      <form id="brand-voice-form" onSubmit={submit} className="grid gap-7" noValidate>
        <FormSection title="Primary Personality">
          <TextField label="Primary Personality Title" value={draft.primaryPersonality} maxLength={titleLimit} error={errors.primaryPersonality} onChange={(value) => update("primaryPersonality", value)} />
          <TextAreaField label="Primary Personality Description" value={draft.primaryPersonalityDescription} maxLength={descriptionLimit} error={errors.primaryPersonalityDescription} onChange={(value) => update("primaryPersonalityDescription", value)} />
        </FormSection>

        <FormSection title="Communication Style">
          <TextField label="Communication Style Title" value={draft.communicationStyle} maxLength={titleLimit} error={errors.communicationStyle} onChange={(value) => update("communicationStyle", value)} />
          <TextAreaField label="Communication Style Description" value={draft.communicationStyleDescription} maxLength={descriptionLimit} error={errors.communicationStyleDescription} onChange={(value) => update("communicationStyleDescription", value)} />
        </FormSection>

        <FormSection title="Brand Traits">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              aria-label="New brand trait"
              value={traitInput}
              maxLength={traitLimit + 1}
              onChange={(event) => { setTraitInput(event.target.value.replace(/^#+/, "")); setTraitError(""); }}
              onKeyDown={handleTraitKeyDown}
              placeholder="e.g. Approachable"
              className="h-11 min-w-0 flex-1 rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm outline-none transition focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100"
            />
            <button type="button" onClick={addTrait} disabled={draft.traits.length >= maximumTraits} className="h-11 rounded-lg border border-[#0058bc] px-4 text-sm font-bold text-[#0058bc] transition hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:border-[#c5d2e5] disabled:text-[#8b96a5]">
              Add
            </button>
          </div>
          {traitError ? <p role="alert" className="text-xs font-semibold text-rose-600">{traitError}</p> : null}
          <div className="flex min-h-8 flex-wrap gap-2">
            {draft.traits.map((trait) => (
              <span key={trait} className="inline-flex items-center gap-2 rounded-full bg-[#e1e0ff] px-3 py-1.5 text-sm font-bold text-[#4648d4]">
                #{trait}
                <button type="button" aria-label={`Remove ${trait} trait`} onClick={() => removeTrait(trait)} className="text-[#4648d4] transition hover:text-[#24269e]">×</button>
              </span>
            ))}
          </div>
          <p className="text-xs text-[#717786]">Up to {maximumTraits} traits, {traitLimit} characters each.</p>
        </FormSection>
      </form>
    </BrandBrainDialog>
  );
}

type VoiceErrors = Record<"primaryPersonality" | "primaryPersonalityDescription" | "communicationStyle" | "communicationStyleDescription", string>;

function validateVoice(voice: BrandVoice): VoiceErrors {
  return {
    primaryPersonality: requiredError(voice.primaryPersonality, "Primary Personality Title", titleLimit),
    primaryPersonalityDescription: requiredError(voice.primaryPersonalityDescription, "Primary Personality Description", descriptionLimit),
    communicationStyle: requiredError(voice.communicationStyle, "Communication Style Title", titleLimit),
    communicationStyleDescription: requiredError(voice.communicationStyleDescription, "Communication Style Description", descriptionLimit),
  };
}

function requiredError(value: string, label: string, limit: number) {
  if (!value.trim()) return `${label} is required.`;
  if (value.length > limit) return `${label} can contain up to ${limit} characters.`;
  return "";
}

function FormSection({ children, title }: { children: React.ReactNode; title: string }) {
  return <section className="grid gap-4"><h3 className="border-b border-[#e5edf8] pb-2 text-sm font-extrabold text-[#0b1c30]">{title}</h3>{children}</section>;
}

function TextField({ error, label, maxLength, onChange, value }: { error: string; label: string; maxLength: number; onChange: (value: string) => void; value: string }) {
  return <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">{label}<input value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} className={`h-11 rounded-lg border bg-white px-3 text-sm font-medium normal-case tracking-normal text-[#0b1c30] outline-none transition focus:ring-2 focus:ring-blue-100 ${error ? "border-rose-400" : "border-[#c5d2e5] focus:border-[#0058bc]"}`} />{error ? <span className="normal-case tracking-normal text-rose-600">{error}</span> : null}</label>;
}

function TextAreaField({ error, label, maxLength, onChange, value }: { error: string; label: string; maxLength: number; onChange: (value: string) => void; value: string }) {
  return <label className="grid gap-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">{label}<textarea value={value} maxLength={maxLength} rows={4} onChange={(event) => onChange(event.target.value)} className={`resize-y rounded-lg border bg-white p-3 text-sm font-medium normal-case leading-6 tracking-normal text-[#0b1c30] outline-none transition focus:ring-2 focus:ring-blue-100 ${error ? "border-rose-400" : "border-[#c5d2e5] focus:border-[#0058bc]"}`} />{error ? <span className="normal-case tracking-normal text-rose-600">{error}</span> : null}</label>;
}
