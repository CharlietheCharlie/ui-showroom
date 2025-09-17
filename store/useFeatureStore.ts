import { featuresData } from "@/public/datas/feature";
import { Feature } from "@/types/types";
import { create } from "zustand";

type FeatureState = {
  viewedAt?: Date;
  data?: any;
};

type FeatureStore = {
  featuresData: Feature[];
  activeFeature: Feature | null;
  features: Record<string, FeatureState>;

  openModal: (featureId: string | number) => void;
  closeModal: () => void;
  updateFeature: (featureId: string, partial: Partial<FeatureState>) => void;
};

export const useFeatureStore = create<FeatureStore>((set) => ({
  featuresData: featuresData,
  activeFeature: null,
  features: {},

  openModal: (featureId) =>
    set((state) => ({
      activeFeature: state.featuresData.find((f) => f.id === featureId) || null,
      features: {
        ...state.features,
        [featureId]: {
          ...(state.features[featureId] ?? {}),
          viewedAt: new Date(),
        },
      },
    })),

  closeModal: () => set({ activeFeature: null }),

  updateFeature: (featureId, partial) =>
    set((state) => ({
      features: {
        ...state.features,
        [featureId]: {
          ...(state.features[featureId] ?? {}),
          ...partial,
        },
      },
    })),
}));
