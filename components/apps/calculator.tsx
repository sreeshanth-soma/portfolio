"use client"

import { useState } from "react"

interface CalculatorProps {
  isDarkMode?: boolean
}

export default function Calculator({ isDarkMode }: CalculatorProps) {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [resetNext, setResetNext] = useState(false)
  const [activeOp, setActiveOp] = useState<string | null>(null)

  const handleNumber = (num: string) => {
    if (resetNext) {
      setDisplay(num)
      setResetNext(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
    setActiveOp(operation)
  }

  const handleDecimal = () => {
    if (resetNext) {
      setDisplay("0.")
      setResetNext(false)
      return
    }
    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const handleOperator = (op: string) => {
    const current = parseFloat(display)
    if (previousValue !== null && !resetNext) {
      const result = calculate(previousValue, current, operation!)
      setDisplay(formatResult(result))
      setPreviousValue(result)
    } else {
      setPreviousValue(current)
    }
    setOperation(op)
    setActiveOp(op)
    setResetNext(true)
  }

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b
      case "−": return a - b
      case "×": return a * b
      case "÷": return b !== 0 ? a / b : 0
      default: return b
    }
  }

  const formatResult = (num: number): string => {
    if (Number.isInteger(num) && Math.abs(num) < 1e15) {
      return num.toString()
    }
    const str = num.toPrecision(10)
    return parseFloat(str).toString()
  }

  const handleEquals = () => {
    if (previousValue === null || operation === null) return
    const current = parseFloat(display)
    const result = calculate(previousValue, current, operation)
    setDisplay(formatResult(result))
    setPreviousValue(null)
    setOperation(null)
    setActiveOp(null)
    setResetNext(true)
  }

  const handleClear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setActiveOp(null)
    setResetNext(false)
  }

  const handleToggleSign = () => {
    if (display !== "0") {
      setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display)
    }
  }

  const handlePercent = () => {
    const current = parseFloat(display)
    setDisplay(formatResult(current / 100))
  }

  const getDisplayFontSize = () => {
    const len = display.replace("-", "").replace(".", "").length
    if (len <= 6) return "text-[32px]"
    if (len <= 8) return "text-[24px]"
    if (len <= 10) return "text-[18px]"
    return "text-[14px]"
  }

  const btnSize = "w-[46px] h-[46px]"
  const btnBase = `${btnSize} flex items-center justify-center select-none transition-colors duration-75 cursor-pointer rounded-full`
  const numBtn = `${btnBase} bg-[#333333] hover:bg-[#737373] active:bg-[#737373] text-white text-[15px] font-light`
  const funcBtn = `${btnBase} bg-[#a5a5a5] hover:bg-[#d9d9d9] active:bg-[#d9d9d9] text-black text-[14px] font-medium`
  const opBtn = `${btnBase} text-white text-[18px] font-light`

  const isActive = (op: string) => activeOp === op && resetNext

  return (
    <div className="w-full h-full bg-[#1c1c1e] flex flex-col select-none overflow-hidden" style={{ minWidth: 0, minHeight: 0 }}>
      {/* Display */}
      <div className="flex items-end justify-end px-4 pb-1 pt-1" style={{ minHeight: 44 }}>
        <span className={`${getDisplayFontSize()} text-white font-light tracking-tight leading-none`}>
          {display}
        </span>
      </div>

      {/* Button grid */}
      <div className="grid grid-cols-4 gap-[10px] px-3 pb-3" style={{ gridTemplateRows: "repeat(5, 46px)" }}>
        {/* Row 1: AC +/- % ÷ */}
        <button className={funcBtn} onClick={handleClear}>
          {display !== "0" || previousValue !== null ? "C" : "AC"}
        </button>
        <button className={funcBtn} onClick={handleToggleSign}>+/−</button>
        <button className={funcBtn} onClick={handlePercent}>%</button>
        <button
          className={`${opBtn} ${isActive("÷") ? "bg-white text-orange-500" : "bg-orange-500 hover:bg-orange-300"}`}
          onClick={() => handleOperator("÷")}
        >÷</button>

        {/* Row 2: 7 8 9 × */}
        <button className={numBtn} onClick={() => handleNumber("7")}>7</button>
        <button className={numBtn} onClick={() => handleNumber("8")}>8</button>
        <button className={numBtn} onClick={() => handleNumber("9")}>9</button>
        <button
          className={`${opBtn} ${isActive("×") ? "bg-white text-orange-500" : "bg-orange-500 hover:bg-orange-300"}`}
          onClick={() => handleOperator("×")}
        >×</button>

        {/* Row 3: 4 5 6 − */}
        <button className={numBtn} onClick={() => handleNumber("4")}>4</button>
        <button className={numBtn} onClick={() => handleNumber("5")}>5</button>
        <button className={numBtn} onClick={() => handleNumber("6")}>6</button>
        <button
          className={`${opBtn} ${isActive("−") ? "bg-white text-orange-500" : "bg-orange-500 hover:bg-orange-300"}`}
          onClick={() => handleOperator("−")}
        >−</button>

        {/* Row 4: 1 2 3 + */}
        <button className={numBtn} onClick={() => handleNumber("1")}>1</button>
        <button className={numBtn} onClick={() => handleNumber("2")}>2</button>
        <button className={numBtn} onClick={() => handleNumber("3")}>3</button>
        <button
          className={`${opBtn} ${isActive("+") ? "bg-white text-orange-500" : "bg-orange-500 hover:bg-orange-300"}`}
          onClick={() => handleOperator("+")}
        >+</button>

        {/* Row 5: 0 (wide) . = */}
        <button
          className={`${btnBase} w-auto bg-[#333333] hover:bg-[#737373] active:bg-[#737373] text-white text-[15px] font-light col-span-2 rounded-full pl-[18px] justify-start`}
          onClick={() => handleNumber("0")}
        >0</button>
        <button className={numBtn} onClick={handleDecimal}>.</button>
        <button
          className={`${opBtn} bg-orange-500 hover:bg-orange-300 active:bg-orange-300`}
          onClick={handleEquals}
        >=</button>
      </div>
    </div>
  )
}
