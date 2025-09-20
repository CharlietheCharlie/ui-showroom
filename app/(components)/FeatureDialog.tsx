import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFeatureStore } from "@/store/useFeatureStore";
import { Suspense } from "react";

export default function FeatureDialog() {
  const { activeFeature} = useFeatureStore();

  // From the active feature data, get the component to render
  const FeatureComponent = activeFeature?.component;

  return (
    <DialogContent className="min-w-full h-auto md:min-w-3xl " showCloseButton={false}>
      <DialogHeader>
        <DialogTitle className="text-2xl">{activeFeature?.title}</DialogTitle>
        <DialogClose
          className="absolute top-4 right-4 text-muted-foreground"
        >
          close
        </DialogClose>
      </DialogHeader>
      <div className="pt-4 h-full overflow-y-auto">
        <Suspense fallback={<div className="text-center">Loading component...</div>}>
          {FeatureComponent ? <FeatureComponent /> : null}
        </Suspense>
      </div>
    </DialogContent>
  );
}