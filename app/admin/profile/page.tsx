"use client"

import { useState } from "react"
import Image from "next/image"
import { Camera, Save } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Panel, PanelHeader } from "@/components/admin/ui"
import { Button } from "@/components/ui/button"

function Field({
  label,
  defaultValue,
  type = "text",
  textarea,
}: {
  label: string
  defaultValue?: string
  type?: string
  textarea?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {textarea ? (
        <textarea
          defaultValue={defaultValue}
          rows={4}
          className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
        />
      ) : (
        <input
          type={type}
          defaultValue={defaultValue}
          className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
        />
      )}
    </label>
  )
}

export default function ProfilePage() {
  const [saved, setSaved] = useState(false)

  return (
    <AdminShell title="Profile" subtitle="Manage your personal information and how you appear to clients">
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="h-28 w-28 overflow-hidden rounded-full ring-4 ring-secondary">
                <Image
                  src="/practitioner-about.png"
                  alt="Soumyaa"
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105"
                aria-label="Change photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="mt-4 font-serif text-xl text-foreground">Soumyaa</h2>
            <p className="text-sm text-muted-foreground">Spiritual Healer &amp; Guide</p>
            <span className="mt-3 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
              Administrator
            </span>
          </div>

          <dl className="mt-6 space-y-3 border-t border-border/60 pt-5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="text-foreground">Jan 2021</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Sessions held</dt>
              <dd className="text-foreground">1,240+</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Avg. rating</dt>
              <dd className="text-foreground">4.9 / 5</dd>
            </div>
          </dl>
        </Panel>

        <div className="space-y-6 lg:col-span-2">
          <Panel>
            <PanelHeader title="Personal Information" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" defaultValue="Soumyaa" />
              <Field label="Title" defaultValue="Spiritual Healer & Guide" />
              <Field label="Email Address" type="email" defaultValue="soumyaa@mysticsouljourney.com" />
              <Field label="WhatsApp Number" defaultValue="+91 97310 55222" />
            </div>
            <div className="mt-4">
              <Field
                label="Bio"
                textarea
                defaultValue="With a deep connection to universal wisdom and a heart for healing, I help you release what no longer serves you, align with your higher self and step into a life of clarity, purpose and joy."
              />
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Public Links" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Instagram" defaultValue="@mysticsouljourney" />
              <Field label="YouTube" defaultValue="Mystic Soul Journey" />
              <Field label="Website" defaultValue="www.mysticsouljourney.com" />
              <Field label="Location" defaultValue="Mumbai, India" />
            </div>
          </Panel>

          <div className="flex items-center justify-end gap-3">
            {saved ? <span className="text-sm text-primary">Changes saved</span> : null}
            <Button
              onClick={() => {
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
              }}
              className="gap-2 rounded-full"
            >
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
