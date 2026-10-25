// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

function displayAlerts(data) {
  const alertsDisplay = document.getElementById("alerts-display")
  const features = data.features

  alertsDisplay.replaceChildren()

  const summary = document.createElement("p")
  summary.textContent = `${data.title}: ${features.length}`
  alertsDisplay.append(summary)

  const alertList = document.createElement("ul")
  features.forEach((alert) => {
    const headline = alert.properties && alert.properties.headline
    if (headline) {
      const item = document.createElement("li")
      item.textContent = headline
      alertList.append(item)
    }
  })
  alertsDisplay.append(alertList)
}

function displayError(message) {
  const errorMessage = document.getElementById("error-message")
  errorMessage.textContent = message
  errorMessage.classList.remove("hidden")
}

async function fetchWeatherAlerts(state) {
  const response = await fetch(`${weatherApi}${state}`)
  if (!response.ok) {
    throw new Error(`Weather alerts request failed (${response.status}).`)
  }

  const data = await response.json()
  if (!data || typeof data.title !== "string" || !Array.isArray(data.features)) {
    throw new Error("The weather alerts response was invalid.")
  }

  console.log(data)
  return data
}

function initializeWeatherAlerts() {
  const input = document.getElementById("state-input")
  const button = document.getElementById("fetch-alerts")
  const alertsDisplay = document.getElementById("alerts-display")
  const errorMessage = document.getElementById("error-message")

  if (!input || !button || !alertsDisplay || !errorMessage || button.dataset.initialized) {
    return
  }
  button.dataset.initialized = "true"

  async function submitRequest() {
    const state = input.value.trim().toUpperCase()
    input.value = ""
    alertsDisplay.replaceChildren()

    if (!/^[A-Z]{2}$/.test(state)) {
      displayError("Please enter a two-letter state abbreviation.")
      return
    }

    try {
      const data = await fetchWeatherAlerts(state)
      displayAlerts(data)
      errorMessage.textContent = ""
      errorMessage.classList.add("hidden")
    } catch (error) {
      console.log(error.message)
      displayError(error.message)
    }
  }

  button.addEventListener("click", submitRequest)
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      submitRequest()
    }
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWeatherAlerts)
} else {
  initializeWeatherAlerts()
}