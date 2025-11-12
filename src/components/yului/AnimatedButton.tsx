import { useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface AnimatedButtonProps {
    label: string;
    icon: React.ElementType;
    onClick: () => void;
    disabled?: boolean;
}

export default function AnimatedButton({
    label,
    icon: Icon,
    onClick,
    disabled,
}: AnimatedButtonProps) {
    const waveControls = useAnimation();
    const hoverControls = useAnimation();
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        onClick();
        setIsAnimating(false);
    };


    return (
        <motion.button
            onClick={handleClick}
            disabled={disabled}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileTap={{ scale: 0.99 }}
            className="
  relative w-full py-3 rounded-xl flex items-center justify-center gap-2
  font-semibold overflow-hidden select-none shadow-2xl
  bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-600
  text-white border border-white/30 backdrop-blur-md
  hover:brightness-110 transition-all duration-300
  cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed
"
        >

            <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
                <Icon className="w-5 h-5 text-white" />
                {label}
            </span>
        </motion.button>
    );
}
