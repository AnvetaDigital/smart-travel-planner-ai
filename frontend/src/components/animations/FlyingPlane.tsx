import { Plane } from "lucide-react";
import { motion } from "framer-motion"

export default function FlyingPlane() {
  return (
    <motion.div
      initial={{
        x: -900,
        y: 900,
        rotate: -20,
      }}
      animate={{
        x: 1200,
        y: -250,
        rotate: 20,
      }}
      transition={{
        duration: 6,
        ease: "easeInOut",
      }}
      className="absolute z-20"
    >
      <Plane size={48} className="text-white" />
    </motion.div>
  );
}