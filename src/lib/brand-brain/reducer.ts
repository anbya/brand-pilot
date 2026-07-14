import { initialBrandBrainData } from "@/lib/brand-brain/initial-data";
import type {
  BrandAnalysis,
  BrandBrainState,
  BrandInformation,
  BrandInsights,
  BrandRecommendation,
  BrandVoice,
  ToneDial,
} from "@/lib/brand-brain/types";

export type BrandBrainAction =
  | { type: "UPDATE_BRAND_INFORMATION"; payload: Partial<BrandInformation> }
  | { type: "UPDATE_BRAND_VOICE"; payload: Partial<BrandVoice> }
  | { type: "UPDATE_TONE_DIAL"; payload: Partial<ToneDial> }
  | { type: "SELECT_BRAND_LOGO"; payload: { assetId: string | null } }
  | { type: "SET_CORE_ASSETS"; payload: { assetIds: string[] } }
  | { type: "UPDATE_RECOMMENDATION"; payload: Partial<BrandRecommendation> }
  | { type: "UPDATE_ANALYSIS"; payload: Partial<BrandAnalysis> }
  | { type: "UPDATE_INSIGHTS"; payload: Partial<BrandInsights> }
  | { type: "RESET_DEMO_DATA" };

export function brandBrainReducer(state: BrandBrainState, action: BrandBrainAction): BrandBrainState {
  switch (action.type) {
    case "UPDATE_BRAND_INFORMATION":
      return { ...state, brand: { ...state.brand, ...action.payload } };
    case "UPDATE_BRAND_VOICE":
      return { ...state, voice: { ...state.voice, ...action.payload } };
    case "UPDATE_TONE_DIAL":
      return { ...state, toneDial: { ...state.toneDial, ...action.payload } };
    case "SELECT_BRAND_LOGO":
      return { ...state, logoAssetId: action.payload.assetId };
    case "SET_CORE_ASSETS":
      return { ...state, coreAssetIds: action.payload.assetIds.slice(0, 3) };
    case "UPDATE_RECOMMENDATION":
      return { ...state, recommendation: { ...state.recommendation, ...action.payload } };
    case "UPDATE_ANALYSIS":
      return { ...state, analysis: { ...state.analysis, ...action.payload } };
    case "UPDATE_INSIGHTS":
      return { ...state, insights: { ...state.insights, ...action.payload } };
    case "RESET_DEMO_DATA":
      return initialBrandBrainData;
    default:
      return state;
  }
}
