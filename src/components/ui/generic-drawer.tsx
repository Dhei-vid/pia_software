"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface GenericDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  position?: "left" | "right";
  headerStyle?: string;
  isHeaderArrow?: boolean;
}

const GenericDrawer: React.FC<GenericDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  position = "right",
  headerStyle,
  isHeaderArrow = true,
}) => {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const positionClasses =
    position === "left"
      ? "left-80 border-r border-lightgrey"
      : "right-65 border-l border-lightgrey";

  const slideVariants = {
    hidden: {
      x: position === "left" ? "-100%" : "100%",
    },
    visible: {
      x: 0,
    },
    exit: { opacity: 0, transition: { duration: 0 } }, // vanish
    // exit: {
    //   x: position === "left" ? "-100%" : "100%", // slide out
    // },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          />

          {/* Drawer */}
          <motion.div
            className={cn(
              `fixed top-0 ${positionClasses} h-full w-80 bg-grey z-50 flex flex-col`,
              className
            )}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-lightgrey flex-shrink-0">
              <h2
                className={cn(
                  headerStyle ? headerStyle : "text-lg font-semibold",
                  "text-white"
                )}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="cursor-pointer p-2 rounded-md hover:bg-[#3a3a3a] transition-colors"
              >
                {isHeaderArrow && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-width min-h-0">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export { GenericDrawer };
