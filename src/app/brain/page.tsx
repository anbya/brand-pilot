import { BrandBrainClient } from "@/components/brand-brain/brand-brain-client";
import { initialBrandBrainData } from "@/lib/brand-brain/initial-data";

export default function BrainPage() {
  return <BrandBrainClient initialData={initialBrandBrainData} />;
}
