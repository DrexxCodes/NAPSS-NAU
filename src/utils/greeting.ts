export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return "Good morning"
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon"
  } else if (hour >= 17 && hour < 22) {
    return "Good evening"
  } else {
    return "Good night"
  }
}

export function getGreetingIcon(): string {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return "🌅"
  } else if (hour >= 12 && hour < 17) {
    return "☀️"
  } else if (hour >= 17 && hour < 22) {
    return "🌆"
  } else {
    return "🌙"
  }
}
