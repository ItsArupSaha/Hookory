"use strict";

import * as React from "react"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    />
))
Avatar.displayName = "Avatar"

import Image from "next/image"

const AvatarImage = React.forwardRef<
    HTMLImageElement,
    React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, alt, width, height, ...props }, ref) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
        fill
        sizes="64px"
        className={cn("aspect-square h-full w-full object-cover", className)}
        alt={alt || "Avatar"}
        {...(props as any)} // Cast to any to avoid strict type mismatch for other HTML attributes like 'crossOrigin' etc if they slightly differ
        // We explicitly ignore width/height because we are using fill
        src={props.src || ""}
    />
))
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
