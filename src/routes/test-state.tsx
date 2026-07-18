import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StateSelect } from "@/components/intake/primitives";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

export const Route = createFileRoute("/test-state")({
  component: () => {
    const [state, setState] = useState("");
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="mx-auto max-w-md pt-20">
          <h1 className="mb-6 text-2xl font-bold">State Select Test</h1>
          <StateSelect
            label="Shipping state"
            value={state}
            onChange={setState}
            states={US_STATES}
          />
          <p className="mt-6 text-sm text-ink/60">Selected: {state || "—"}</p>
        </div>
      </div>
    );
  },
});
