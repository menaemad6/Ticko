
import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => {
  const isMobile = useIsMobile()
  
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        "relative flex items-center justify-center bg-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
        // Mobile-optimized sizing and touch targets
        isMobile ? "w-6" : "w-px",
        "after:absolute after:inset-y-0 after:left-1/2 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
        isMobile ? "after:w-6" : "after:w-1",
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0",
        "[&[data-panel-group-direction=vertical]>div]:rotate-90",
        className
      )}
      style={{ 
        touchAction: 'pan-x',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        cursor: isMobile ? 'ew-resize' : 'col-resize'
      }}
      {...props}
    >
      {withHandle && (
        <div className={cn(
          "z-10 flex items-center justify-center rounded-sm border bg-border",
          isMobile ? "h-8 w-6" : "h-4 w-3"
        )}>
          <GripVertical className={cn(
            isMobile ? "h-4 w-4" : "h-2.5 w-2.5"
          )} />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
