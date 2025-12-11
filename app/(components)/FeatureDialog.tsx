import { Badge } from "@/components/ui/badge";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFeatureStore } from "@/store/useFeatureStore";
import { Suspense } from "react";

export default function FeatureDialog() {
  const { activeFeature } = useFeatureStore();

  // From the active feature data, get the component to render
  const FeatureComponent = activeFeature?.component;

  return (
    <DialogContent
      className="min-w-full max-h-[90vh] overflow-auto md:min-w-3xl "
      showCloseButton={false}
    >
      <DialogHeader>
        <DialogTitle className="text-2xl">{activeFeature?.title}</DialogTitle>
        <DialogDescription>
          <div>
            <span className="mb-2 block">{activeFeature?.description}</span>
           {!!activeFeature?.techStack?.length && (
             activeFeature?.techStack.map((tech) => (
               <Badge key={tech} className="mr-2">{tech}</Badge>
             ))
           )}
          </div>
        </DialogDescription>
        <DialogClose className="absolute top-4 right-4 text-muted-foreground">
          close
        </DialogClose>
      </DialogHeader>
      <div className="pt-4 h-full overflow-y-auto">
        <Suspense
          fallback={<div className="text-center">Loading component...</div>}
        >
          {FeatureComponent ? <FeatureComponent /> : null}
        </Suspense>
      </div>
    </DialogContent>
  );
}
