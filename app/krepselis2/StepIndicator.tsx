"use client";

export default function StepIndicator({ currentStep }: any) {
  const steps = [
    { id: "cart", label: "Krepšelis" },
    { id: "address", label: "Adresas" },
    { id: "payment", label: "Apmokėjimas" },
    { id: "confirmation", label: "Patvirtinimas" }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center ${currentStep === step.id ? "text-slate-900" : "text-gray-400"}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === step.id ? "bg-slate-900 text-white" : "bg-gray-200"
              }`}>
                {index + 1}
              </div>
              <span className="ml-2">{step.label}</span>
            </div>

            {index < steps.length - 1 && (
              <div className="w-12 h-1 mx-2 bg-gray-200"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
