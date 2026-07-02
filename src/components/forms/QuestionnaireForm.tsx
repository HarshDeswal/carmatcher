"use client";

import { useState } from "react";
import { submitQuestionnaire } from "@/actions/search";
import { Button } from "@/components/ui/Button";
import {
  FUEL_TYPES,
  TRANSMISSIONS,
  BODY_TYPES,
  PRIMARY_USAGES,
  PRIORITIES,
} from "@/lib/types";

const BUDGET_OPTIONS = [
  { value: 500000, label: "Under ₹5 Lakh" },
  { value: 800000, label: "₹5 – 8 Lakh" },
  { value: 1200000, label: "₹8 – 12 Lakh" },
  { value: 1800000, label: "₹12 – 18 Lakh" },
  { value: 2500000, label: "₹18 – 25 Lakh" },
  { value: 3500000, label: "₹25 – 35 Lakh" },
  { value: 5000000, label: "₹35 – 50 Lakh" },
  { value: 7000000, label: "Above ₹50 Lakh" },
];

const FAMILY_SIZE_OPTIONS = [
  { value: 2, label: "2 people" },
  { value: 4, label: "4 people" },
  { value: 5, label: "5 people" },
  { value: 6, label: "6 people" },
  { value: 7, label: "7+ people" },
];

export function QuestionnaireForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await submitQuestionnaire(formData);
    } catch {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <FormSection
        title="What's your budget?"
        description="Select your maximum budget in Indian Rupees"
      >
        <RadioGroup name="budget" options={BUDGET_OPTIONS} defaultValue={1200000} />
      </FormSection>

      <FormSection
        title="Preferred fuel type"
        description="What type of fuel do you prefer?"
      >
        <RadioGroup
          name="fuelType"
          options={FUEL_TYPES.map((f) => ({ value: f.value, label: f.label }))}
          defaultValue="petrol"
        />
      </FormSection>

      <FormSection
        title="Transmission preference"
        description="Manual or automatic?"
      >
        <RadioGroup
          name="transmission"
          options={TRANSMISSIONS.map((t) => ({ value: t.value, label: t.label }))}
          defaultValue="manual"
        />
      </FormSection>

      <FormSection
        title="Body type"
        description="What kind of car body do you prefer?"
      >
        <RadioGroup
          name="bodyType"
          options={BODY_TYPES.map((b) => ({ value: b.value, label: b.label }))}
          defaultValue="suv"
        />
      </FormSection>

      <FormSection
        title="Family size"
        description="How many people will regularly travel in the car?"
      >
        <RadioGroup
          name="familySize"
          options={FAMILY_SIZE_OPTIONS}
          defaultValue={5}
        />
      </FormSection>

      <FormSection
        title="Primary usage"
        description="Where will you drive most often?"
      >
        <RadioGroup
          name="primaryUsage"
          options={PRIMARY_USAGES.map((u) => ({ value: u.value, label: u.label }))}
          defaultValue="mixed"
        />
      </FormSection>

      <FormSection
        title="Top priority"
        description="What matters most to you in a car?"
      >
        <RadioGroup
          name="priority"
          options={PRIORITIES.map((p) => ({ value: p.value, label: p.label }))}
          defaultValue="mileage"
        />
      </FormSection>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Finding matches..." : "Get My Recommendations"}
        </Button>
      </div>
    </form>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function RadioGroup({
  name,
  options,
  defaultValue,
}: {
  name: string;
  options: { value: string | number; label: string }[];
  defaultValue: string | number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => (
        <label
          key={option.value}
          className="relative flex cursor-pointer items-center rounded-xl border border-gray-200 px-4 py-3 transition hover:border-brand-300 hover:bg-brand-50/50 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50 has-[:checked]:ring-1 has-[:checked]:ring-brand-600"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            defaultChecked={option.value === defaultValue}
            className="h-4 w-4 border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="ml-3 text-sm font-medium text-gray-700">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}
