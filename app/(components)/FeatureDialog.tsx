import {
    DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FeatureDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DialogContent className="min-w-full h-full">
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogClose className="absolute top-4 right-4 text-muted-foreground">Cancel</DialogClose>
        <DialogDescription>{children}</DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
