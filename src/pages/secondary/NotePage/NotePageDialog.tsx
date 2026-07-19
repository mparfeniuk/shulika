import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import * as React from 'react'

import { randomString } from '@/lib/random'
import { cn } from '@/lib/utils'
import { useSecondaryPage } from '@/PageManager'
import modalManager from '@/services/modal-manager.service'

const Dialog = ({ children, open, onOpenChange, ...props }: DialogPrimitive.DialogProps) => {
  const [innerOpen, setInnerOpen] = React.useState(open ?? false)
  const id = React.useMemo(() => `dialog-${randomString()}`, [])

  React.useEffect(() => {
    if (open !== undefined) {
      return
    }

    if (innerOpen) {
      modalManager.register(id, () => {
        setInnerOpen(false)
      })
    } else {
      modalManager.unregister(id)
    }
  }, [innerOpen])

  return (
    <DialogPrimitive.Root
      open={true}
      onOpenChange={onOpenChange ?? setInnerOpen}
      {...props}
    >
      {children}
    </DialogPrimitive.Root>
  )
}

const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    withoutClose?: boolean
  }
>(({ className, children, ...props }, ref) => {
  const { pop } = useSecondaryPage();

  React.useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === 'Escape') {
        pop();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pop]);

  const closeDialog = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    pop()
  }

  return (<DialogPortal>
    <DialogOverlay onClick={closeDialog} />
    <DialogPrimitive.Content
      onInteractOutside={(e) => e.preventDefault()}
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 flex flex-col w-full max-w-lg max-h-[85vh] [transform:translate(-50%,-50%)] bg-background pt-6! pb-6! shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl sm:border',
        className
      )}
      {...props}
    >
      <DialogPrimitive.Close onClick={closeDialog} className="absolute right-4 top-4 rounded-lg p-1 opacity-70 ring-offset-background transition-all hover:bg-accent hover:opacity-100 outline-hidden ring-2 ring-ring ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>

      <div className="overflow-y-auto flex-1 min-h-0 pr-6 pt-12 custom-scrollbar">
        {children}
      </div>
      <div className="absolute bottom-0 z-10 flex h-40 w-full items-end justify-center bg-linear-to-b from-transparent to-background/90 pb-4"></div>
    </DialogPrimitive.Content>
  </DialogPortal>)
})
DialogContent.displayName = DialogPrimitive.Content.displayName



export {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle
}
