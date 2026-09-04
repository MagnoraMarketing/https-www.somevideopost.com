"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Globe, Target, Clock, Plus, X, Check, Loader2, ChevronDown } from "lucide-react";
import { saveChannelSettings, type PostingSlot } from "@/services/channel-settings";

const DAYS_SHORT = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"];

const TIMEZONES = [
  "Europe/Copenhagen",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Europe/Stockholm",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Asia/Dubai",
];

const GOAL_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 10, 14, 21];

type Tab = "schedule" | "general";

type Props = {
  accountId: string;
  platform: string;
  platformColor: string;
  initialSettings: {
    timezone: string;
    posting_goal: number;
    posting_slots: PostingSlot[];
  };
};

export function ChannelSettingsClient({ accountId, platform, platformColor, initialSettings }: Props) {
  const [tab, setTab] = useState<Tab>("schedule");
  const [timezone, setTimezone] = useState(initialSettings.timezone);
  const [goal, setGoal] = useState(initialSettings.posting_goal);
  const [slots, setSlots] = useState<PostingSlot[]>(initialSettings.posting_slots);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function toggleDay(day: number) {
    setSlots((prev) =>
      prev.map((s) => (s.day === day ? { ...s, enabled: !s.enabled } : s))
    );
  }

  function addTime(day: number) {
    setSlots((prev) =>
      prev.map((s) =>
        s.day === day ? { ...s, times: [...s.times, "09:00"] } : s
      )
    );
  }

  function removeTime(day: number, idx: number) {
    setSlots((prev) =>
      prev.map((s) =>
        s.day === day ? { ...s, times: s.times.filter((_, i) => i !== idx) } : s
      )
    );
  }

  function updateTime(day: number, idx: number, value: string) {
    setSlots((prev) =>
      prev.map((s) =>
        s.day === day
          ? { ...s, times: s.times.map((t, i) => (i === idx ? value : t)) }
          : s
      )
    );
  }

  function handleSave() {
    startTransition(async () => {
      await saveChannelSettings({ accountId, timezone, posting_goal: goal, posting_slots: slots });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="space-y-0">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-slate-200 mb-8">
        {(["schedule", "general"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "schedule" ? "Posting Schedule" : "General"}
          </button>
        ))}
      </div>

      {tab === "schedule" && (
        <div className="space-y-0 divide-y divide-slate-100">

          {/* Time Zone */}
          <div className="flex items-center justify-between py-6">
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Globe size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Tidszone</p>
                <p className="text-sm text-blue-600 mt-0.5">Tidszone brugt til planlægning for denne kanal</p>
              </div>
            </div>
            <div className="relative">
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none cursor-pointer"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace("_", " ").split("/").pop()}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Posting Goal */}
          <div className="flex items-center justify-between py-6">
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                <Target size={16} className="text-orange-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Posting mål</p>
                <p className="text-sm text-slate-500 mt-0.5">Vælg hvor ofte du ønsker at poste på denne kanal per uge</p>
              </div>
            </div>
            <div className="relative">
              <select
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none cursor-pointer"
              >
                {GOAL_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "opslag" : "opslag"} / uge
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Posting Slots */}
          <div className="py-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <Clock size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Posting slots</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  Dine postetider fortæller systemet, hvornår opslag i din kø skal sendes.
                </p>
              </div>
            </div>

            {/* Day grid */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-7">
                {DAYS_SHORT.map((d, i) => (
                  <div key={i} className={`border-r border-slate-100 last:border-r-0 ${i > 0 ? "" : ""}`}>
                    {/* Day header */}
                    <div className="px-3 py-3 border-b border-slate-100 text-center">
                      <p className="text-xs font-bold text-slate-700">{d}</p>
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-1.5 px-2 py-2.5 border-b border-slate-100">
                      <span className="text-[10px] text-slate-400">{slots[i]?.enabled ? "On" : "Off"}</span>
                      <button
                        type="button"
                        onClick={() => toggleDay(i)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          slots[i]?.enabled ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                            slots[i]?.enabled ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Time slots */}
                    <div className="p-2 space-y-1.5 min-h-[60px]">
                      {slots[i]?.enabled &&
                        slots[i].times.map((time, ti) => (
                          <div key={ti} className="flex items-center gap-1">
                            <input
                              type="time"
                              value={time}
                              onChange={(e) => updateTime(i, ti, e.target.value)}
                              className="flex-1 min-w-0 rounded border border-slate-200 px-1.5 py-1 text-[11px] font-mono text-slate-700 focus:border-slate-400 focus:outline-none text-center"
                            />
                            {slots[i].times.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTime(i, ti)}
                                className="shrink-0 rounded p-0.5 text-slate-300 hover:text-red-400 transition-colors"
                              >
                                <X size={10} />
                              </button>
                            )}
                          </div>
                        ))}
                    </div>

                    {/* Add time */}
                    {slots[i]?.enabled && (
                      <div className="px-2 pb-3">
                        <button
                          type="button"
                          onClick={() => addTime(i)}
                          className="w-full flex items-center justify-center gap-1 rounded-lg border border-dashed border-slate-200 py-1.5 text-[10px] text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors"
                        >
                          <Plus size={9} /> Tilføj
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-6">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : saved ? (
                <Check size={14} />
              ) : null}
              {saved ? "Gemt!" : "Gem indstillinger"}
            </button>
          </div>
        </div>
      )}

      {tab === "general" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Kanaloplysninger</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Platform</span>
                <span className="flex items-center gap-2 text-sm font-medium text-slate-900 capitalize">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: platformColor }}
                  />
                  {platform}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">Status</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Forbundet
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <h3 className="font-semibold text-slate-900 mb-1">Frakobl kanal</h3>
            <p className="text-sm text-slate-500 mb-4">Dette fjerner kanalen og alle dens indstillinger.</p>
            <Link
              href="/accounts"
              className="inline-flex items-center rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Frakobl
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
