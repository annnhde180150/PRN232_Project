import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Card variants based on design system specifications
const cardVariants = cva(
  // Base styles - common to all cards
  [
    "bg-white rounded-lg border border-gray-200",
    "transition-all duration-normal",
    "overflow-hidden",
  ],
  {
    variants: {
      variant: {
        // Default card - basic styling
        default: ["shadow-md"],
        // Elevated card - more prominent shadow
        elevated: ["shadow-lg"],
        // Interactive card - hover effects
        interactive: [
          "shadow-md cursor-pointer",
          "hover:shadow-lg hover:border-gray-300",
          "active:shadow-sm active:scale-[0.98]",
          "focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2",
        ],
        // Outlined card - border emphasis
        outlined: ["shadow-sm border-2", "hover:border-primary-200"],
      },
      padding: {
        none: "p-0",
        small: "p-4",
        medium: "p-6",
        large: "p-8",
      },
      size: {
        small: "max-w-sm",
        medium: "max-w-md",
        large: "max-w-lg",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "medium",
      size: "full",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * If true, the card will be rendered as a button element
   */
  asButton?: boolean;
  /**
   * If true, the card will have a subtle animation on mount
   */
  animated?: boolean;
}

/**
 * Base Card component following the design system specifications
 *
 * Features:
 * - Multiple variants: default, elevated, interactive, outlined
 * - Configurable padding and size
 * - Hover and focus states
 * - Can be rendered as button for interactive cards
 * - Responsive design
 * - Accessibility compliant
 */
const Card = React.forwardRef<HTMLDivElement | HTMLButtonElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      size,
      asButton = false,
      animated = false,
      children,
      ...props
    },
    ref
  ) => {
    if (asButton) {
      // Render as button
      return (
        <button
          className={cn(
            cardVariants({ variant, padding, size }),
            animated && "animate-fade-in",
            className
          )}
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          role="button"
          tabIndex={0}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }
    // Render as div
    return (
      <div
        className={cn(
          cardVariants({ variant, padding, size }),
          animated && "animate-fade-in",
          className
        )}
        ref={ref as React.Ref<HTMLDivElement>}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Card Header component
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// Card Title component
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-h5 font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// Card Description component
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-body-small text-text-secondary", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// Card Content component
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Card Footer component
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};
