import { assetLibraryMockData } from "@/lib/assets/mock-data";
import type { AssetKind, WorkspaceAsset } from "@/lib/assets/types";

const storageKey = "brand-pilot-asset-library-v1";
const eventName = "brand-pilot-assets-changed";

export function readAssetLibrary(storage?: Pick<Storage, "getItem">): WorkspaceAsset[] {
  if (!storage) return assetLibraryMockData.map(cloneAsset);
  try { const value = storage.getItem(storageKey); if (!value) return assetLibraryMockData.map(cloneAsset); const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed as WorkspaceAsset[] : assetLibraryMockData.map(cloneAsset); }
  catch { return assetLibraryMockData.map(cloneAsset); }
}

export function writeAssetLibrary(storage: Pick<Storage, "setItem">, assets: WorkspaceAsset[]) {
  storage.setItem(storageKey, JSON.stringify(assets));
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(eventName, { detail: assets }));
}

export function subscribeToAssetLibrary(listener: (assets: WorkspaceAsset[]) => void) {
  const handle = (event: Event) => listener((event as CustomEvent<WorkspaceAsset[]>).detail);
  window.addEventListener(eventName, handle);
  return () => window.removeEventListener(eventName, handle);
}

export function syncBrandAssetReferences(storage: Pick<Storage, "getItem" | "setItem">, brandId: string, logoAssetId: string | null, coreAssetIds: string[]) {
  const next = readAssetLibrary(storage).map((asset) => {
    const usage = asset.usage.filter((item) => !(item.entityId === brandId && (item.type === "brand-logo" || item.type === "brand-core")));
    if (asset.id === logoAssetId) usage.push({ type: "brand-logo", entityId: brandId, label: "Coffee XYZ brand logo" });
    if (coreAssetIds.includes(asset.id)) usage.push({ type: "brand-core", entityId: brandId, label: "Coffee XYZ core visual" });
    const selected = asset.id === logoAssetId || coreAssetIds.includes(asset.id);
    return { ...asset, usage, brandIds: selected && !asset.brandIds.includes(brandId) ? [...asset.brandIds, brandId] : asset.brandIds };
  });
  writeAssetLibrary(storage, next);
  return next;
}

export function kindFromMime(mimeType: string): AssetKind {
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "document";
  if (mimeType === "image/svg+xml") return "logo";
  return "image";
}

export function mockPreviewDataUrl(name: string, kind: AssetKind) {
  const label = kind === "video" ? "VIDEO" : kind === "document" ? "DOCUMENT" : kind === "logo" ? "LOGO" : "IMAGE";
  const safeName = name.replace(/[<>&]/g, "").slice(0, 28);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#dceaff"/><stop offset="1" stop-color="#eee9ff"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="46%" text-anchor="middle" font-family="Arial" font-size="34" font-weight="700" fill="#0058bc">${label}</text><text x="50%" y="55%" text-anchor="middle" font-family="Arial" font-size="22" fill="#414755">${safeName}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function cloneAsset(asset: WorkspaceAsset): WorkspaceAsset { return { ...asset, tags: [...asset.tags], brandIds: [...asset.brandIds], campaignIds: [...asset.campaignIds], usage: asset.usage.map((item) => ({ ...item })) }; }
