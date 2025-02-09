import lang from "@/common/lang"
import {
  useEffect,
  useState,
} from "react"

const { generateIdea } = lang

export const useGreeting = () => {
  const [greeting, setGreeting] = useState("Good morning")
  useEffect(() => {
    const today = new Date()
    const curHr = today.getHours()
    if (curHr < 12) {
      setGreeting(generateIdea.greeting.morning)
    } else if (curHr < 18) {
      setGreeting(generateIdea.greeting.afternoon)
    } else {
      setGreeting(generateIdea.greeting.evening)
    }
  }, [])

  return {
    greeting,
  }
}
