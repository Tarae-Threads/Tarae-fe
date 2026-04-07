"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/components/ui/button"

// ---------------------------------------------------------------------------
// Dialog (Root)
// ---------------------------------------------------------------------------

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

// ---------------------------------------------------------------------------
// DialogTrigger
// ---------------------------------------------------------------------------

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

// ---------------------------------------------------------------------------
// DialogClose
// ---------------------------------------------------------------------------

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

// ---------------------------------------------------------------------------
// DialogPortal
// ---------------------------------------------------------------------------

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

// ---------------------------------------------------------------------------
// DialogOverlay
// ---------------------------------------------------------------------------

function DialogOverlay({
  className,
  visible = true,
  ...props
}: DialogPrimitive.Backdrop.Props & { visible?: boolean }) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
        visible
          ? "bg-black/10 supports-backdrop-filter:backdrop-blur-xs"
          : "bg-transparent",
        className
      )}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// DialogContent
// ---------------------------------------------------------------------------

function DialogContent({
  className,
  children,
  showCloseButton = true,
  showOverlay = true,
  style,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
  showOverlay?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay visible={showOverlay} />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-3xl bg-surface p-6 editorial-shadow transition-all duration-200",
          "data-starting-style:scale-95 data-starting-style:opacity-0",
          "data-ending-style:scale-95 data-ending-style:opacity-0",
          className
        )}
        style={style}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-3 right-3"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">닫기</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

// ---------------------------------------------------------------------------
// DialogHeader
// ---------------------------------------------------------------------------

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// DialogFooter — sticky at bottom
// ---------------------------------------------------------------------------

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// DialogTitle
// ---------------------------------------------------------------------------

function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-title-lg font-bold text-on-surface", className)}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// DialogDescription
// ---------------------------------------------------------------------------

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-body-sm text-on-surface-variant", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
