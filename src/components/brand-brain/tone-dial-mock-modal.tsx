"use client";

import { useState } from "react";
import { BrandBrainDialog } from "@/components/brand-brain/brand-brain-dialog";
import type { ToneDial } from "@/lib/brand-brain/types";

type ToneDialKey = keyof ToneDial;

const sliderDefinitions: Array<{
  key: ToneDialKey;
  left: string;
  right: string;
}> = [
  { key: "casualFormal", left: "Casual", right: "Formal" },
  { key: "playfulSerious", left: "Playful", right: "Serious" },
  { key: "conciseDetailed", left: "Concise", right: "Detailed" },
];

export function ToneDialMockModal({
  currentToneDial,
  isOpen,
  onClose,
  onSave,
}: {
  currentToneDial: ToneDial;
  isOpen: boolean;
  onClose: () => void;
  onSave: (toneDial: ToneDial) => void;
}) {
  const [draftToneDial, setDraftToneDial] = useState<ToneDial>(() => ({ ...currentToneDial }));

  if (!isOpen) return null;

  function update(key: ToneDialKey, value: number) {
    setDraftToneDial((current) => ({ ...current, [key]: value }));
  }

  return (
    <BrandBrainDialog
      title="Adjust Tone Dial"
      description="Fine-tune how your brand communicates across content."
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="h-11 rounded-lg border border-[#c5d2e5] bg-white px-5 text-sm font-bold text-[#414755] transition hover:bg-[#eff4ff] focus:outline-none focus:ring-2 focus:ring-[#78aef5]">
            Cancel
          </button>
          <button type="button" onClick={() => onSave({ ...draftToneDial })} className="h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white transition hover:bg-[#004493] focus:outline-none focus:ring-2 focus:ring-[#78aef5]">
            Save Changes
          </button>
        </>
      }
    >
      <div className="grid gap-5">
        {sliderDefinitions.map((slider) => {
          const value = draftToneDial[slider.key];
          return (
            <section key={slider.key} className="rounded-xl border border-[#d3e4fe] bg-[#f8faff] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0b1c30]">{slider.left} to {slider.right}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#0058bc]">{interpretToneValue(slider.key, value)}</p>
                </div>
                <output htmlFor={`tone-${slider.key}`} className="flex h-9 min-w-12 items-center justify-center rounded-lg bg-[#e5eeff] px-3 text-sm font-extrabold tabular-nums text-[#0058bc]">
                  {value}
                </output>
              </div>

              <label className="mt-5 block" htmlFor={`tone-${slider.key}`}>
                <span className="sr-only">{slider.left} to {slider.right}</span>
                <input
                  id={`tone-${slider.key}`}
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={value}
                  aria-label={`${slider.left} to ${slider.right}`}
                  onChange={(event) => update(slider.key, Number(event.target.value))}
                  className="h-2 w-full cursor-pointer accent-[#0058bc] outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                />
              </label>
              <div className="mt-2 flex justify-between text-[11px] font-extrabold uppercase tracking-[.12em] text-[#657080]">
                <span>{slider.left}</span>
                <span>{slider.right}</span>
              </div>
            </section>
          );
        })}
      </div>
    </BrandBrainDialog>
  );
}

export function interpretToneValue(key: ToneDialKey, value: number) {
  const [left, right] = key === "casualFormal"
    ? ["Casual", "Formal"]
    : key === "playfulSerious"
      ? ["Playful", "Serious"]
      : ["Concise", "Detailed"];

  if (value <= 20) return `Strongly ${left}`;
  if (value <= 40) return `Mostly ${left}`;
  if (value <= 59) return "Balanced";
  if (value <= 79) return `Mostly ${right}`;
  return `Strongly ${right}`;
}
