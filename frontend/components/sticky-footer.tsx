"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Github, Twitter } from "lucide-react"

export function StickyFooter() {
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const windowHeight = window.innerHeight
          const documentHeight = document.documentElement.scrollHeight
          const isNearBottom = scrollTop + windowHeight >= documentHeight - 100

          setIsAtBottom(isNearBottom)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Check initial state
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <AnimatePresence>
      {isAtBottom && (
        <motion.div
          className="fixed z-50 bottom-0 left-0 w-full h-80 flex justify-center items-center"
          style={{ backgroundColor: "#e78a53" }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div
            className="relative overflow-hidden w-full h-full flex flex-col md:flex-row justify-between px-6 md:px-12 items-start py-8 md:py-12"
            style={{ color: "#121113" }}
          >
            <motion.div
              className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-12 md:space-x-16 lg:space-x-24 text-sm sm:text-base md:text-lg z-10 w-full md:w-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <ul className="space-y-2">
                <li className="font-bold mb-3" style={{ color: "#121113" }}>Platform</li>
                <li>
                  <a
                    href="/"
                    className="hover:underline cursor-pointer transition-colors"
                    style={{ color: "#121113" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(18, 17, 19, 0.8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#121113")}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="hover:underline cursor-pointer transition-colors"
                    style={{ color: "#121113" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(18, 17, 19, 0.8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#121113")}
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/browse"
                    className="hover:underline cursor-pointer transition-colors"
                    style={{ color: "#121113" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(18, 17, 19, 0.8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#121113")}
                  >
                    Browse
                  </a>
                </li>
                <li>
                  <a
                    href="/connect"
                    className="hover:underline cursor-pointer transition-colors"
                    style={{ color: "#121113" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(18, 17, 19, 0.8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#121113")}
                  >
                    Connect Wallet
                  </a>
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="font-bold mb-3" style={{ color: "#121113" }}>Resources</li>
                <li>
                  <a
                    href="https://solana.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline cursor-pointer transition-colors"
                    style={{ color: "#121113" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(18, 17, 19, 0.8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#121113")}
                  >
                    Solana Docs
                  </a>
                </li>
                <li>
                  <a
                    href="https://arweave.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline cursor-pointer transition-colors"
                    style={{ color: "#121113" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(18, 17, 19, 0.8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#121113")}
                  >
                    Arweave
                  </a>
                </li>
                <li>
                  <a
                    href="/GUIDE.md"
                    className="hover:underline cursor-pointer transition-colors"
                    style={{ color: "#121113" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(18, 17, 19, 0.8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#121113")}
                  >
                    Documentation
                  </a>
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="font-bold mb-3" style={{ color: "#121113" }}>Legal</li>
                <li>
                  <span
                    className="cursor-pointer transition-colors text-xs"
                    style={{ color: "#121113", opacity: 0.8 }}
                  >
                    © {currentYear} CryptInk
                  </span>
                </li>
                <li>
                  <span
                    className="cursor-pointer transition-colors text-xs"
                    style={{ color: "#121113", opacity: 0.8 }}
                  >
                    Built on Solana
                  </span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              className="hidden md:flex absolute bottom-4 right-8 items-center gap-4"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <img
                src="/cryptink-logo.png"
                alt="CryptInk Logo"
                className="h-32 lg:h-48 opacity-90"
                style={{ filter: "brightness(0.1)" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
