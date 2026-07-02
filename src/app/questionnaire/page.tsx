import { QuestionnaireForm } from "@/components/forms/QuestionnaireForm";

export const metadata = {
  title: "Questionnaire — AI Car Matchmaker",
  description: "Tell us your preferences to get personalized car recommendations.",
};

export default function QuestionnairePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Car Preference Questionnaire
        </h1>
        <p className="mt-3 text-gray-600">
          Answer these questions so we can find your perfect car match from our
          database of 60+ Indian cars.
        </p>
      </div>

      <QuestionnaireForm />
    </div>
  );
}
