import { initialBrandBrainData } from "@/lib/brand-brain/initial-data";
import type {
  BrandAnalysis,
  BrandAsset,
  BrandBrainState,
  BrandInformation,
  BrandInsights,
  BrandLogo,
  BrandRecommendation,
  BrandVoice,
  ToneDial,
} from "@/lib/brand-brain/types";

export type BrandBrainAction =
  | { type: "UPDATE_BRAND_INFORMATION"; payload: Partial<BrandInformation> }
  | { type: "UPDATE_BRAND_VOICE"; payload: Partial<BrandVoice> }
  | { type: "UPDATE_TONE_DIAL"; payload: Partial<ToneDial> }
  | { type: "UPDATE_BRAND_LOGO"; payload: BrandLogo }
  | { type: "ADD_ASSET"; payload: BrandAsset }
  | { type: "UPDATE_ASSET"; payload: { id: string; changes: Partial<BrandAsset> } }
  | { type: "DELETE_ASSET"; payload: { id: string } }
  | { type: "SET_CORE_ASSET"; payload: { id: string } }
  | { type: "REMOVE_CORE_ASSET"; payload: { id: string } }
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
    case "UPDATE_BRAND_LOGO":
      return { ...state, logo: action.payload };
    case "ADD_ASSET":
      return { ...state, assets: [...state.assets, action.payload] };
    case "UPDATE_ASSET":
      return { ...state, assets: state.assets.map((asset) => asset.id === action.payload.id ? { ...asset, ...action.payload.changes } : asset) };
    case "DELETE_ASSET":
      return { ...state, assets: state.assets.filter((asset) => asset.id !== action.payload.id) };
    case "SET_CORE_ASSET":
      return { ...state, assets: state.assets.map((asset) => asset.id === action.payload.id ? { ...asset, isCoreAsset: true } : asset) };
    case "REMOVE_CORE_ASSET":
      return { ...state, assets: state.assets.map((asset) => asset.id === action.payload.id ? { ...asset, isCoreAsset: false } : asset) };
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
