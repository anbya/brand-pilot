"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BrandBrainDialog } from "@/components/brand-brain/brand-brain-dialog";
import { BrandBrainDrawer } from "@/components/brand-brain/brand-brain-drawer";
import { brandAssetTypes, EditBrandAssetMockModal, readableBrandAssetType } from "@/components/brand-brain/edit-brand-asset-mock-modal";
import type { BrandAsset, BrandAssetType } from "@/lib/brand-brain/types";

export function ManageAssetsMockDrawer({ assets, isOpen, onClose, onDeleteAsset, onRemoveCore, onReplaceCore, onSetCore, onUpdateAsset }: {
  assets: BrandAsset[]; isOpen: boolean; onClose: () => void;
  onDeleteAsset: (asset: BrandAsset) => void; onRemoveCore: (id: string) => void;
  onReplaceCore: (oldId: string, newId: string) => void; onSetCore: (id: string) => void;
  onUpdateAsset: (asset: BrandAsset) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState<"all" | BrandAssetType>("all");
  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState<BrandAsset | null>(null);
  const [selectedAssetForDelete, setSelectedAssetForDelete] = useState<BrandAsset | null>(null);
  const [assetToSetAsCore, setAssetToSetAsCore] = useState<BrandAsset | null>(null);
  const [selectedCoreAssetToReplace, setSelectedCoreAssetToReplace] = useState("");
  const coreAssets = assets.filter((asset) => asset.isCoreAsset).slice(0, 3);
  const filteredAssets = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return assets.filter((asset) => {
      const matchesType = assetTypeFilter === "all" || asset.assetType === assetTypeFilter;
      const matchesQuery = !query || asset.name.toLocaleLowerCase().includes(query) || asset.description.toLocaleLowerCase().includes(query) || asset.tags.some((tag) => tag.toLocaleLowerCase().includes(query));
      return matchesType && matchesQuery;
    });
  }, [assetTypeFilter, assets, searchQuery]);

  if (!isOpen) return null;

  function requestSetCore(asset: BrandAsset) {
    if (coreAssets.length < 3) onSetCore(asset.id);
    else { setAssetToSetAsCore(asset); setSelectedCoreAssetToReplace(""); }
  }

  function replaceCore() {
    if (!assetToSetAsCore || !selectedCoreAssetToReplace) return;
    onReplaceCore(selectedCoreAssetToReplace, assetToSetAsCore.id);
    setAssetToSetAsCore(null); setSelectedCoreAssetToReplace("");
  }

  return <BrandBrainDrawer title="Manage Brand Assets" description="Organize, review, and choose the primary visual references for your brand." onClose={onClose}>
    <div className="sticky top-0 z-10 border-b border-[#d3e4fe] bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <label className="grid gap-1.5 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">Search assets<input aria-label="Search brand assets" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Name, description, or tag" className="h-11 rounded-lg border border-[#c5d2e5] px-3 text-sm font-medium normal-case tracking-normal text-[#0b1c30] outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100" /></label>
        <label className="grid gap-1.5 text-xs font-extrabold uppercase tracking-[.12em] text-[#657080]">Asset Type<select aria-label="Filter by asset type" value={assetTypeFilter} onChange={(event) => setAssetTypeFilter(event.target.value as "all" | BrandAssetType)} className="h-11 rounded-lg border border-[#c5d2e5] bg-white px-3 text-sm font-medium normal-case tracking-normal text-[#0b1c30] outline-none focus:border-[#0058bc] focus:ring-2 focus:ring-blue-100"><option value="all">All Types</option>{brandAssetTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
      </div>
      <div className="mt-3 flex gap-4 text-xs font-bold text-[#657080]"><span>{assets.length} Total Assets</span><span>{coreAssets.length} Core Assets</span></div>
    </div>

    <div className="p-5 sm:p-7">
      {!assets.length ? <EmptyState title="No brand assets yet." description="Upload your first asset from the Brand Brain overview." onClear={onClose} action="Close" /> : !filteredAssets.length ? <EmptyState title="No assets match your search." description="Try another search term or clear the active filters." onClear={() => { setSearchQuery(""); setAssetTypeFilter("all"); }} action="Clear Filters" /> : <div className="grid gap-4 sm:grid-cols-2">{filteredAssets.map((asset) => <AssetCard key={asset.id} asset={asset} onDelete={() => setSelectedAssetForDelete(asset)} onEdit={() => setSelectedAssetForEdit(asset)} onRemoveCore={() => onRemoveCore(asset.id)} onSetCore={() => requestSetCore(asset)} />)}</div>}
    </div>

    {assetToSetAsCore ? <BrandBrainDialog title="Replace Core Brand Asset" description="You already have three Core Brand Assets. Choose one asset to replace." onClose={() => setAssetToSetAsCore(null)} footer={<><button type="button" onClick={() => setAssetToSetAsCore(null)} className="h-11 rounded-lg border border-[#c5d2e5] px-5 text-sm font-bold text-[#414755]">Cancel</button><button type="button" disabled={!selectedCoreAssetToReplace} onClick={replaceCore} className="h-11 rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#aab8ca]">Replace Asset</button></>}><div className="grid gap-3 sm:grid-cols-3">{coreAssets.map((asset) => <label key={asset.id} className={`cursor-pointer overflow-hidden rounded-xl border p-2 ${selectedCoreAssetToReplace === asset.id ? "border-[#0058bc] bg-[#eff4ff] ring-2 ring-blue-100" : "border-[#c5d2e5]"}`}><input type="radio" name="replace-managed-core" className="sr-only" checked={selectedCoreAssetToReplace === asset.id} onChange={() => setSelectedCoreAssetToReplace(asset.id)} /><span className="relative block aspect-square overflow-hidden rounded-lg"><Image src={asset.imageUrl} alt={asset.name} fill unoptimized={asset.imageUrl.startsWith("blob:")} className="object-cover" /></span><span className="mt-2 block truncate text-xs font-extrabold">{asset.name}</span><span className="mt-1 block text-[10px] text-[#657080]">{readableBrandAssetType(asset.assetType)}</span></label>)}</div>{!selectedCoreAssetToReplace ? <p className="mt-3 text-xs font-semibold text-rose-600">Choose one existing core asset to replace.</p> : null}</BrandBrainDialog> : null}

    {selectedAssetForEdit ? <EditBrandAssetMockModal asset={selectedAssetForEdit} onClose={() => setSelectedAssetForEdit(null)} onSave={(updated) => { onUpdateAsset(updated); setSelectedAssetForEdit(null); }} /> : null}

    {selectedAssetForDelete ? <BrandBrainDialog title="Delete Brand Asset" description={`Are you sure you want to delete ${selectedAssetForDelete.name}? This action only affects the current prototype session.`} onClose={() => setSelectedAssetForDelete(null)} footer={<><button type="button" onClick={() => setSelectedAssetForDelete(null)} className="h-11 rounded-lg border border-[#c5d2e5] px-5 text-sm font-bold text-[#414755]">Cancel</button><button type="button" onClick={() => { onDeleteAsset(selectedAssetForDelete); setSelectedAssetForDelete(null); }} className="h-11 rounded-lg bg-rose-600 px-5 text-sm font-bold text-white hover:bg-rose-700">Delete Asset</button></>}><div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800">{selectedAssetForDelete.isCoreAsset ? <b>This asset is currently used as a Core Brand Asset.</b> : "The asset will be removed from this prototype session."}</div></BrandBrainDialog> : null}
  </BrandBrainDrawer>;
}

function AssetCard({ asset, onDelete, onEdit, onRemoveCore, onSetCore }: { asset: BrandAsset; onDelete: () => void; onEdit: () => void; onRemoveCore: () => void; onSetCore: () => void }) {
  const contain = ["logo", "icon", "illustration", "template"].includes(asset.assetType);
  return <article className="overflow-hidden rounded-xl border border-[#d3e4fe] bg-white shadow-sm transition hover:shadow-md"><div className="relative aspect-[16/10] bg-[#eff4ff]"><Image src={asset.imageUrl} alt={asset.name} fill unoptimized={asset.imageUrl.startsWith("blob:")} className={contain ? "object-contain p-4" : "object-cover"} />{asset.isCoreAsset ? <span className="absolute left-3 top-3 rounded-full bg-[#0058bc] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.08em] text-white">Core Asset</span> : null}</div><div className="p-4"><h3 className="truncate text-sm font-extrabold text-[#0b1c30]">{asset.name}</h3><p className="mt-1 text-xs font-semibold text-[#0058bc]">{readableBrandAssetType(asset.assetType)}</p><div className="mt-3 flex flex-wrap gap-1.5">{asset.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-[#e5eeff] px-2 py-1 text-[10px] font-bold text-[#0058bc]">{tag}</span>)}</div><p className="mt-3 line-clamp-1 text-xs text-[#657080]">Usage: {asset.usage.slice(0, 2).map(readableUsage).join(", ")}{asset.usage.length > 2 ? ` +${asset.usage.length - 2}` : ""}</p><p className="mt-1 text-xs font-semibold text-[#657080]">{asset.isCoreAsset ? "Currently used as a core visual reference." : "Available in the brand asset library."}</p><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={asset.isCoreAsset ? onRemoveCore : onSetCore} className="rounded-lg border border-[#0058bc] px-3 py-2 text-xs font-bold text-[#0058bc] hover:bg-[#eff4ff]">{asset.isCoreAsset ? "Remove from Core" : "Set as Core"}</button><button type="button" onClick={onEdit} className="rounded-lg border border-[#c5d2e5] px-3 py-2 text-xs font-bold text-[#414755] hover:bg-[#f8faff]">Edit Details</button><button type="button" onClick={onDelete} className="col-span-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100">Delete Asset</button></div></div></article>;
}

function EmptyState({ action, description, onClear, title }: { action: string; description: string; onClear: () => void; title: string }) { return <div className="rounded-xl border-2 border-dashed border-[#c5d2e5] px-5 py-14 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e5eeff] text-xl text-[#0058bc]">□</span><h3 className="mt-4 text-base font-extrabold">{title}</h3><p className="mt-2 text-sm text-[#657080]">{description}</p><button type="button" onClick={onClear} className="mt-5 rounded-lg border border-[#0058bc] px-4 py-2 text-sm font-bold text-[#0058bc]">{action}</button></div>; }
function readableUsage(value: string) { return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
