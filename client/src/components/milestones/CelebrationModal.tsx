'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Trophy } from 'lucide-react';
import { useEffect } from 'react';

interface CelebrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    completedStages: number;
    totalStages: number;
    careerGoal: string;
    onViewAllMilestones: () => void;
}

export default function CelebrationModal({
    isOpen,
    onClose,
    completedStages,
    totalStages,
    careerGoal,
    onViewAllMilestones
}: CelebrationModalProps) {

    useEffect(() => {
        if (isOpen) {
            triggerConfetti();
        }
    }, [isOpen]);

    const triggerConfetti = () => {
        // Create confetti effect
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Create confetti from both sides
            createConfettiParticle(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            createConfettiParticle(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    };

    const createConfettiParticle = (options: any) => {
        // Simple confetti particle creation using canvas
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const particles: any[] = [];
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

        for (let i = 0; i < options.particleCount; i++) {
            particles.push({
                x: canvas.width * options.origin.x,
                y: canvas.height * options.origin.y,
                vx: (Math.random() - 0.5) * options.startVelocity,
                vy: Math.random() * -options.startVelocity,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }

        let ticks = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.5; // gravity
                particle.rotation += particle.rotationSpeed;

                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation * Math.PI / 180);
                ctx.fillStyle = particle.color;
                ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                ctx.restore();

                if (particle.y > canvas.height) {
                    particles.splice(index, 1);
                }
            });

            ticks++;
            if (ticks < options.ticks && particles.length > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(canvas);
            }
        };

        animate();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.5, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0.5, rotate: 10 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            animate={{ 
                                rotate: [0, 10, -10, 10, 0],
                                scale: [1, 1.1, 1.1, 1.1, 1]
                            }}
                            transition={{ 
                                duration: 0.5,
                                repeat: Infinity,
                                repeatDelay: 2
                            }}
                            className="mb-6 inline-block"
                        >
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                <PartyPopper className="w-12 h-12 text-white" />
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
                        >
                            🎉 Congratulations! 🎉
                        </motion.h2>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-gray-700 mb-6"
                        >
                            You've completed all stages of your milestone!
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6"
                        >
                            <div className="flex items-center justify-center gap-4 mb-3">
                                <Trophy className="w-8 h-8 text-yellow-500" />
                                <span className="text-2xl font-bold text-gray-900">
                                    {completedStages}/{totalStages} Stages
                                </span>
                                <Trophy className="w-8 h-8 text-yellow-500" />
                            </div>
                            <p className="text-gray-600 font-medium">
                                You're one step closer to your goal of becoming a <span className="font-bold text-purple-600">{careerGoal}</span>!
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex gap-3"
                        >
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Continue Learning
                            </button>
                            <button
                                onClick={onViewAllMilestones}
                                className="flex-1 px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all"
                            >
                                View All Milestones
                            </button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
