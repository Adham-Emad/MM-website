'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'

export default function MirnasMotivation() {
  const [isOpened, setIsOpened] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [cheerMeter, setCheerMeter] = useState(0)
  const [meterBarInView, setMeterBarInView] = useState(false)
  const [showFinalMessage, setShowFinalMessage] = useState(false)
  const [fireworks, setFireworks] = useState([])
  const [showArabicModal, setShowArabicModal] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isOpened) return

    // Intersection Observer to detect when meter bar enters view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !meterBarInView) {
            setMeterBarInView(true)
          }
        })
      },
      { threshold: 0.5 }
    )

    const meterElement = document.getElementById('cheer-meter')
    if (meterElement) {
      observer.observe(meterElement)
    }

    return () => {
      if (meterElement) observer.unobserve(meterElement)
    }
  }, [isOpened, meterBarInView])

  useEffect(() => {
    if (meterBarInView && !showArabicModal) {
      setCheerMeter(100)
    }
  }, [meterBarInView, showArabicModal])

  const handleEnvelopeClick = () => {
    if (!isOpened) {
      setIsOpened(true)
      setShowConfetti(true)

      // Create multiple firework bursts
      const newFireworks = []
      for (let i = 0; i < 8; i++) {
        newFireworks.push({
          id: i,
          delay: i * 200,
          x: Math.random() * 80 + 10,
          y: Math.random() * 40 + 10,
        })
      }
      setFireworks(newFireworks)

      // Trigger multiple confetti bursts for bigger celebration
      setTimeout(() => {
        setShowConfetti(false)
      }, 3500)
    }
  }

  const handleMeterClick = () => {
    if (cheerMeter === 100) {
      setShowArabicModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowArabicModal(false)
  }

  const FloatingElement = ({ delay, duration, x, y, emoji, size }) => (
    <motion.div
      className="absolute pointer-events-none"
      animate={{
        y: [0, -30, 0],
        x: [0, Math.sin(delay) * 20, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
      style={{ left: x, top: y, fontSize: size }}
      whileHover={{ scale: 1.2 }}
    >
      {emoji}
    </motion.div>
  )

  const Firework = ({ delay, x, y }) => {
    const particles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i / 12) * Math.PI * 2,
    }))

    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{ left: `${x}%`, top: `${y}%` }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay, duration: 1.5 }}
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 pointer-events-none"
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
            }}
            animate={{
              x: Math.cos(particle.angle) * 80,
              y: Math.sin(particle.angle) * 80,
              opacity: 0,
            }}
            transition={{
              delay,
              duration: 1,
              ease: 'easeOut',
            }}
            style={{
              background:
                ['#ffa500', '#ff6b35', '#c91e8c', '#ff1493', '#ffd700'][
                  particle.id % 5
                ],
              borderRadius: '50%',
              boxShadow: `0 0 8px ${
                ['#ffa500', '#ff6b35', '#c91e8c', '#ff1493', '#ffd700'][
                  particle.id % 5
                ]
              }`,
            }}
          />
        ))}
      </motion.div>
    )
  }

  const FallingEmoji = ({ emoji, delay, duration, x }) => (
    <motion.div
      className="fixed pointer-events-none text-4xl"
      initial={{ y: -50, x: x, opacity: 1 }}
      animate={{ y: windowSize.height + 100, opacity: 0, rotate: 360 }}
      transition={{ delay, duration, ease: 'easeIn' }}
      style={{ left: x }}
    >
      {emoji}
    </motion.div>
  )

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#e6d5f5] via-[#fff5f2] to-[#ffe4f5] overflow-hidden relative">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={250}
          gravity={0.3}
        />
      )}

      {/* Fireworks Bursts */}
      {fireworks.map((firework) => (
        <Firework key={firework.id} delay={firework.delay / 1000} x={firework.x} y={firework.y} />
      ))}

      {/* Falling Celebration Emojis */}
      {isOpened &&
        [
          { emoji: '✨', delay: 0.2, duration: 2.5, x: '10%' },
          { emoji: '🎉', delay: 0.4, duration: 2.8, x: '20%' },
          { emoji: '💫', delay: 0.6, duration: 2.6, x: '30%' },
          { emoji: '⭐', delay: 0.8, duration: 2.9, x: '40%' },
          { emoji: '🌟', delay: 1, duration: 2.7, x: '50%' },
          { emoji: '💖', delay: 1.2, duration: 2.8, x: '60%' },
          { emoji: '🎊', delay: 1.4, duration: 2.6, x: '70%' },
          { emoji: '✨', delay: 1.6, duration: 2.9, x: '80%' },
          { emoji: '💜', delay: 1.8, duration: 2.7, x: '90%' },
        ].map((item, index) => (
          <FallingEmoji
            key={index}
            emoji={item.emoji}
            delay={item.delay}
            duration={item.duration}
            x={item.x}
          />
        ))}

      {/* Floating Elements - Stars, Books, Graduation Caps */}
      <FloatingElement delay={0} duration={4} x="10%" y="15%" emoji="⭐" size="2rem" />
      <FloatingElement
        delay={0.5}
        duration={5}
        x="85%"
        y="20%"
        emoji="🎓"
        size="2.5rem"
      />
      <FloatingElement delay={1} duration={4.5} x="20%" y="70%" emoji="📚" size="2rem" />
      <FloatingElement
        delay={1.5}
        duration={5}
        x="80%"
        y="75%"
        emoji="✨"
        size="2.5rem"
      />
      <FloatingElement delay={0.8} duration={4} x="50%" y="85%" emoji="🌟" size="2rem" />
      <FloatingElement
        delay={1.3}
        duration={4.5}
        x="15%"
        y="45%"
        emoji="💜"
        size="2.5rem"
      />

      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8">
        {/* Main Heading */}
        <motion.div
          className="text-center mb-8 md:mb-12 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c91e8c] via-[#ff6b35] to-[#ffa500] mb-4 text-balance">
            Mirna, You Are Unstoppable! ✨
          </h1>
          <p className="text-lg md:text-xl text-[#6b1b7a] font-medium text-pretty">
            Our Shining Star, Your Potential is Limitless
          </p>
        </motion.div>

        {/* Interactive Envelope */}
        <motion.div
          className="z-20 mb-12 cursor-pointer"
          animate={isOpened ? { scale: 1.1 } : {}}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <motion.div
            onClick={handleEnvelopeClick}
            className="relative w-72 md:w-80 h-48 md:h-56 bg-gradient-to-br from-[#ffa500] via-[#ff6b35] to-[#c91e8c] rounded-2xl shadow-2xl cursor-pointer transform hover:scale-105 transition-transform"
            whileHover={{ y: -10 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Envelope Front */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffa500] via-[#ff6b35] to-[#c91e8c] rounded-2xl flex items-center justify-center">
              {!isOpened ? (
                <motion.div
                  className="text-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-5xl mb-3">💌</div>
                  <p className="text-white font-bold text-lg">Click to Open</p>
                </motion.div>
              ) : (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-5xl mb-2">💖</div>
                  <p className="text-white font-bold">Message Received!</p>
                </motion.div>
              )}
            </div>

            {/* Envelope Flap - Opens upward */}
            {isOpened && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-[#ffa500] to-[#ff6b35] rounded-t-2xl"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -180 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{ transformOrigin: 'top', perspective: '1000px' }}
              />
            )}
          </motion.div>
        </motion.div>

        {/* Message Card - Appears after opening */}
        <AnimatePresence>
          {isOpened && (
            <motion.div
              className="z-10 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white bg-opacity-80 backdrop-blur-md border-2 border-[#c91e8c] rounded-2xl p-6 md:p-8 shadow-xl">
                <h2 className="text-2xl md:text-3xl font-bold text-[#c91e8c] mb-4 text-balance">
                  A Message Just For You
                </h2>
                <div className="text-[#6b1b7a] text-base md:text-lg leading-relaxed space-y-4">
                  <p>
                    Dear Mirna, your hard work doesn't go unnoticed. Every single effort you
                    pour into this course matters more than you realize.
                  </p>
                  <p>
                    It's okay to feel tired. It's okay to feel overwhelmed. But let me tell you
                    something that's absolutely true: <span className="font-bold">You are much
                    stronger than any curriculum.</span>
                  </p>
                  <p>
                    The obstacles you're facing aren't walls—they're stepping stones. Each
                    challenge you overcome is proof of your incredible resilience and
                    determination.
                  </p>
                  <p className="font-semibold text-[#ff6b35]">
                    🌟 You've got this. Stay focused, stay strong, and remember: the scrolling
                    trap can wait. Your dreams can't.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cheer Meter */}
        <motion.div
          id="cheer-meter"
          className="z-10 w-full max-w-md mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className={`bg-white bg-opacity-70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#ffa500] ${
              cheerMeter === 100 && !showArabicModal ? 'cursor-pointer' : ''
            }`}
            onClick={handleMeterClick}
            whileHover={cheerMeter === 100 && !showArabicModal ? { scale: 1.05 } : {}}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-[#c91e8c]">Your Motivation Level</h3>
              <motion.span
                className="text-3xl"
                animate={{ scale: meterBarInView ? [1, 1.3, 1] : 1 }}
                transition={{ repeat: meterBarInView ? 2 : 0, duration: 0.5 }}
              >
                🔥
              </motion.span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#ff6b35] via-[#ffa500] to-[#c91e8c]"
                initial={{ width: 0 }}
                animate={{ width: meterBarInView ? '100%' : 0 }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </div>
            <motion.p
              className="text-center text-sm text-[#6b1b7a] font-semibold mt-3"
              animate={{ scale: meterBarInView ? 1.05 : 1 }}
            >
              {cheerMeter === 100
                ? 'Click here to see your message! 💖'
                : 'Scroll down to unlock your power!'}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Arabic Modal - Appears when meter is clicked */}
        <AnimatePresence>
          {showArabicModal && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
              />

              {/* Modal */}
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={handleCloseModal}
              >
                <motion.div
                  className="bg-gradient-to-br from-[#ffa500] to-[#c91e8c] rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-white max-w-lg w-full"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ scale: 0.8, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <motion.div
                    className="text-center mb-6"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="text-6xl">✨💖</div>
                  </motion.div>

                  <motion.div
                    className="bg-white bg-opacity-25 rounded-2xl p-8 text-center border-3 border-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <p
                      className="text-white font-bold text-2xl md:text-3xl leading-loose"
                      dir="rtl"
                    >
                      انتي مميزة دايما خليكي فاكره ده كل لحظة تعب دلوقتي هي استثمار في نجاح كبير
                      جاي.
                    </p>
                  </motion.div>

                  <motion.p
                    className="text-white text-center text-sm md:text-base font-semibold mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Click outside to close and get back to your focus ✨
                  </motion.p>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Inspiring Affirmations - Scroll into view */}
        {!showFinalMessage && (
          <motion.div
            className="z-10 max-w-2xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 px-4 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[
              '✨ You are capable',
              '💪 You are strong',
              '🎯 You are focused',
              '🌟 You are brilliant',
            ].map((affirmation, index) => (
              <motion.div
                key={index}
                className="bg-white bg-opacity-60 backdrop-blur-md rounded-xl p-4 text-center text-[#6b1b7a] font-semibold border border-[#ffa500] hover:bg-opacity-80 transition-all"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                {affirmation}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Footer Inspiration */}
        <motion.p
          className="z-10 text-center text-[#6b1b7a] font-semibold mt-12 text-sm md:text-base px-4 text-pretty max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Remember: This is temporary. Your strength is permanent. You will look back on
          this moment and be so proud of yourself. Keep going, superstar. 🌈
        </motion.p>
      </div>
    </main>
  )
}
