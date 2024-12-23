import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

export function Toast({ title, description, variant = "default" }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
            variant === "destructive"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          <h3 className="font-bold">{title}</h3>
          <p>{description}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
