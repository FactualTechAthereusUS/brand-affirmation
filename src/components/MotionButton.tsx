import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";

type Props = HTMLMotionProps<"button"> & {
  lift?: boolean; // subtle upward drift on hover
};

/**
 * Shared button primitive with tactile hover/tap spring.
 * Use like a regular <button> — animation is opt-out via reduced-motion.
 */
export const MotionButton = forwardRef<HTMLButtonElement, Props>(
  ({ lift = true, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={lift ? { scale: 1.02, y: -1 } : { scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      {...props}
    />
  ),
);
MotionButton.displayName = "MotionButton";

type LinkProps = HTMLMotionProps<"a"> & { lift?: boolean };

export const MotionLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ lift = true, ...props }, ref) => (
    <motion.a
      ref={ref}
      whileHover={lift ? { scale: 1.02, y: -1 } : { scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      {...props}
    />
  ),
);
MotionLink.displayName = "MotionLink";
