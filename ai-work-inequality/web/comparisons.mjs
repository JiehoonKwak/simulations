import { PRESETS } from "./empirical-model.mjs";

const common = {
  ...PRESETS.find((p) => p.id === "shared").params,
  capacityGrowth: 40,
  demandChange: 0,
  staffingResponse: 0,
  captureProprietor: 0.8,
  captureSalaried: 0.8,
};
export const COMPARISONS = [
  {
    id: "time-dividend",
    label: "Less work, same care",
    description:
      "Demand stays flat; original positions remain. Time savings become spare work capacity.",
    params: { ...common },
  },
  {
    id: "care-expansion",
    label: "More care, same positions",
    description:
      "The same technology meets 25% more demand; original positions remain.",
    params: { ...common, demandChange: 25 },
  },
  {
    id: "shared-adjustment",
    label: "Fewer positions, shared gains",
    description:
      "The same care output with full staffing adjustment; both groups participate equally in gains.",
    params: { ...common, demandChange: 25, staffingResponse: 1 },
  },
  {
    id: "unequal-adjustment",
    label: "Fewer positions, unequal gains",
    description:
      "Only salaried gain participation changes, from 80% to 20%; care and work are unchanged.",
    params: {
      ...common,
      demandChange: 25,
      staffingResponse: 1,
      captureSalaried: 0.2,
    },
  },
];
