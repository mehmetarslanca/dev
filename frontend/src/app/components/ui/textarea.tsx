import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "input-glass-opaque resize-none flex field-sizing-content min-h-24 w-full rounded-sm border px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-mono focus-visible:ring-1 focus-visible:ring-primary",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
