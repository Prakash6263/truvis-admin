"use client"

import { useState, useEffect } from "react"

const Preloader = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    <div className="preloader">
      <div className="loader-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Preloader
