document.addEventListener("DOMContentLoaded", () => {
  // Initialize booking form
  initBookingForm()

  // Check if there's a service parameter in the URL
  const urlParams = new URLSearchParams(window.location.search)
  const serviceParam = urlParams.get("service")

  if (serviceParam) {
    // Select the service in the form
    const serviceRadio = document.getElementById(serviceParam)
    if (serviceRadio) {
      serviceRadio.checked = true

      // Add visual feedback
      const serviceLabel = serviceRadio.parentElement.querySelector("label")
      serviceLabel.classList.add("pulse-animation")

      setTimeout(() => {
        serviceLabel.classList.remove("pulse-animation")
      }, 1500)
    }
  }

  // Add animation to booking steps
  animateBookingSteps()
})

function initBookingForm() {
  // Set min date for service date input to today
  const serviceDateInput = document.getElementById("service-date")
  if (serviceDateInput) {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const dd = String(today.getDate()).padStart(2, "0")
    const formattedDate = `${yyyy}-${mm}-${dd}`

    serviceDateInput.setAttribute("min", formattedDate)
    serviceDateInput.value = formattedDate

    // Add calendar date picker enhancement
    serviceDateInput.addEventListener("focus", function () {
      this.style.borderColor = "var(--primary-color)"
      this.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.2)"
    })

    serviceDateInput.addEventListener("blur", function () {
      this.style.borderColor = ""
      this.style.boxShadow = ""
    })
  }

  // Add validation to form fields
  const requiredFields = document.querySelectorAll("input[required], select[required], textarea[required]")
  requiredFields.forEach((field) => {
    field.addEventListener("blur", function () {
      validateField(this)
    })

    // Add focus effects
    field.addEventListener("focus", function () {
      this.style.borderColor = "var(--primary-color)"
      this.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.2)"
    })
  })

  // Add hover effects to service options
  const serviceOptions = document.querySelectorAll(".service-option label")
  serviceOptions.forEach((option) => {
    option.addEventListener("mouseenter", function () {
      if (!this.parentElement.querySelector("input").checked) {
        this.style.transform = "translateY(-5px)"
        this.style.boxShadow = "var(--shadow)"
      }
    })

    option.addEventListener("mouseleave", function () {
      if (!this.parentElement.querySelector("input").checked) {
        this.style.transform = ""
        this.style.boxShadow = ""
      }
    })
  })

  // Add hover effects to time slots
  const timeSlots = document.querySelectorAll(".time-slot label")
  timeSlots.forEach((slot) => {
    slot.addEventListener("mouseenter", function () {
      if (!this.parentElement.querySelector("input").checked) {
        this.style.transform = "translateY(-3px)"
        this.style.boxShadow = "var(--shadow)"
      }
    })

    slot.addEventListener("mouseleave", function () {
      if (!this.parentElement.querySelector("input").checked) {
        this.style.transform = ""
        this.style.boxShadow = ""
      }
    })
  })
}

function animateBookingSteps() {
  const steps = document.querySelectorAll(".step")

  steps.forEach((step, index) => {
    setTimeout(() => {
      step.style.opacity = "0"
      step.style.transform = "translateY(10px)"

      setTimeout(() => {
        step.style.transition = "opacity 0.5s ease, transform 0.5s ease"
        step.style.opacity = index === 0 ? "1" : "0.5"
        step.style.transform = "translateY(0)"
      }, 100)
    }, index * 150)
  })
}

function validateField(field) {
  const fieldValue = field.value.trim()
  const fieldName = field.getAttribute("name")
  const fieldType = field.getAttribute("type")

  // Remove any existing error message
  const existingError = field.parentElement.querySelector(".error-message")
  if (existingError) {
    existingError.remove()
  }

  // Reset field style
  field.style.borderColor = ""

  // Check if field is empty
  if (fieldValue === "") {
    showError(field, "This field is required")
    return false
  }

  // Validate email format
  if (fieldType === "email" && !isValidEmail(fieldValue)) {
    showError(field, "Please enter a valid email address")
    return false
  }

  // Validate phone format
  if (fieldName === "phone" && !isValidPhone(fieldValue)) {
    showError(field, "Please enter a valid phone number")
    return false
  }

  return true
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone) {
  const phoneRegex = /^[\d\s$$$$\-+]{10,15}$/
  return phoneRegex.test(phone)
}

function showError(field, message) {
  // Add error styling to field
  field.style.borderColor = "var(--danger-color)"
  field.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.2)"

  // Create error message element
  const errorElement = document.createElement("div")
  errorElement.className = "error-message"
  errorElement.textContent = message
  errorElement.style.color = "var(--danger-color)"
  errorElement.style.fontSize = "0.8rem"
  errorElement.style.marginTop = "5px"
  errorElement.style.fontWeight = "500"
  errorElement.style.display = "flex"
  errorElement.style.alignItems = "center"

  // Add error icon
  const errorIcon = document.createElement("i")
  errorIcon.className = "fas fa-exclamation-circle"
  errorIcon.style.marginRight = "5px"

  errorElement.prepend(errorIcon)

  // Add error message after the field
  const parent = field.parentElement
  parent.appendChild(errorElement)

  // Add shake animation
  field.classList.add("shake-animation")
  setTimeout(() => {
    field.classList.remove("shake-animation")
  }, 500)
}

function nextStep(currentStep) {
  // Validate current step before proceeding
  if (!validateStep(currentStep)) {
    return
  }

  // Hide current step
  const currentForm = document.getElementById(`form-step${currentStep}`)
  const currentStepIndicator = document.getElementById(`step${currentStep}`)

  currentForm.style.opacity = "1"
  currentForm.style.transform = "translateX(0)"

  // Animate transition
  currentForm.style.transition = "opacity 0.3s ease, transform 0.3s ease"
  currentForm.style.opacity = "0"
  currentForm.style.transform = "translateX(-20px)"

  setTimeout(() => {
    currentForm.classList.remove("active")
    currentStepIndicator.classList.remove("active")

    // Show next step
    const nextForm = document.getElementById(`form-step${currentStep + 1}`)
    const nextStepIndicator = document.getElementById(`step${currentStep + 1}`)

    nextForm.classList.add("active")
    nextStepIndicator.classList.add("active")

    // Prepare for entrance animation
    nextForm.style.opacity = "0"
    nextForm.style.transform = "translateX(20px)"

    // Trigger entrance animation
    setTimeout(() => {
      nextForm.style.transition = "opacity 0.3s ease, transform 0.3s ease"
      nextForm.style.opacity = "1"
      nextForm.style.transform = "translateX(0)"
    }, 50)

    // If moving to confirmation step, update summary
    if (currentStep === 4) {
      updateBookingSummary()
    }

    // Scroll to top of form
    document.querySelector(".booking-form-container").scrollIntoView({ behavior: "smooth" })
  }, 300)
}

function prevStep(currentStep) {
  // Hide current step
  const currentForm = document.getElementById(`form-step${currentStep}`)
  const currentStepIndicator = document.getElementById(`step${currentStep}`)

  currentForm.style.opacity = "1"
  currentForm.style.transform = "translateX(0)"

  // Animate transition
  currentForm.style.transition = "opacity 0.3s ease, transform 0.3s ease"
  currentForm.style.opacity = "0"
  currentForm.style.transform = "translateX(20px)"

  setTimeout(() => {
    currentForm.classList.remove("active")
    currentStepIndicator.classList.remove("active")

    // Show previous step
    const prevForm = document.getElementById(`form-step${currentStep - 1}`)
    const prevStepIndicator = document.getElementById(`step${currentStep - 1}`)

    prevForm.classList.add("active")
    prevStepIndicator.classList.add("active")

    // Prepare for entrance animation
    prevForm.style.opacity = "0"
    prevForm.style.transform = "translateX(-20px)"

    // Trigger entrance animation
    setTimeout(() => {
      prevForm.style.transition = "opacity 0.3s ease, transform 0.3s ease"
      prevForm.style.opacity = "1"
      prevForm.style.transform = "translateX(0)"
    }, 50)

    // Scroll to top of form
    document.querySelector(".booking-form-container").scrollIntoView({ behavior: "smooth" })
  }, 300)
}

function validateStep(step) {
  let isValid = true

  switch (step) {
    case 1:
      // Validate service selection
      const serviceSelected = document.querySelector('input[name="service"]:checked')
      if (!serviceSelected) {
        const serviceSection = document.querySelector(".service-selection")
        serviceSection.classList.add("shake-animation")

        setTimeout(() => {
          serviceSection.classList.remove("shake-animation")
        }, 500)

        // Show error message
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please select a service'
        errorMsg.style.color = "var(--danger-color)"
        errorMsg.style.fontSize = "0.9rem"
        errorMsg.style.marginTop = "10px"
        errorMsg.style.textAlign = "center"
        errorMsg.style.fontWeight = "500"

        // Remove any existing error message
        const existingError = document.querySelector(".service-selection + .error-message")
        if (existingError) {
          existingError.remove()
        }

        serviceSection.parentNode.insertBefore(errorMsg, serviceSection.nextSibling)

        isValid = false
      }
      break

    case 2:
      // Validate vehicle details
      const vehicleMake = document.getElementById("vehicle-make")
      const vehicleModel = document.getElementById("vehicle-model")
      const vehicleYear = document.getElementById("vehicle-year")

      if (!validateField(vehicleMake) || !validateField(vehicleModel) || !validateField(vehicleYear)) {
        isValid = false
      }
      break

    case 3:
      // Validate date and time
      const serviceDate = document.getElementById("service-date")
      const serviceTime = document.querySelector('input[name="service-time"]:checked')

      if (!validateField(serviceDate)) {
        isValid = false
      }

      if (!serviceTime) {
        const timeSlots = document.querySelector(".time-slots")
        timeSlots.classList.add("shake-animation")

        setTimeout(() => {
          timeSlots.classList.remove("shake-animation")
        }, 500)

        // Show error message
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please select a time slot'
        errorMsg.style.color = "var(--danger-color)"
        errorMsg.style.fontSize = "0.9rem"
        errorMsg.style.marginTop = "10px"
        errorMsg.style.fontWeight = "500"

        // Remove any existing error message
        const existingError = document.querySelector(".time-slots + .error-message")
        if (existingError) {
          existingError.remove()
        }

        timeSlots.parentNode.insertBefore(errorMsg, timeSlots.nextSibling)

        isValid = false
      }
      break

    case 4:
      // Validate personal details
      const fullName = document.getElementById("full-name")
      const email = document.getElementById("email")
      const phone = document.getElementById("phone")
      const terms = document.getElementById("terms")

      if (!validateField(fullName) || !validateField(email) || !validateField(phone)) {
        isValid = false
      }

      if (!terms.checked) {
        const termsGroup = terms.parentElement
        termsGroup.classList.add("shake-animation")

        setTimeout(() => {
          termsGroup.classList.remove("shake-animation")
        }, 500)

        // Show error message
        const errorMsg = document.createElement("div")
        errorMsg.className = "error-message"
        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please agree to the terms and conditions'
        errorMsg.style.color = "var(--danger-color)"
        errorMsg.style.fontSize = "0.9rem"
        errorMsg.style.marginTop = "5px"
        errorMsg.style.fontWeight = "500"

        // Remove any existing error message
        const existingError = termsGroup.querySelector(".error-message")
        if (existingError) {
          existingError.remove()
        }

        termsGroup.appendChild(errorMsg)

        isValid = false
      }
      break
  }

  return isValid
}

function updateBookingSummary() {
  // Get selected service
  const selectedService = document.querySelector('input[name="service"]:checked')
  const serviceName = selectedService ? selectedService.parentElement.querySelector(".service-name").textContent : ""
  const servicePrice = selectedService ? selectedService.parentElement.querySelector(".service-price").textContent : ""

  // Get vehicle details
  const vehicleMake = document.getElementById("vehicle-make").value
  const vehicleModel = document.getElementById("vehicle-model").value
  const vehicleYear = document.getElementById("vehicle-year").value
  const licensePlate = document.getElementById("license-plate").value

  // Get appointment details
  const serviceDate = document.getElementById("service-date").value
  const formattedDate = new Date(serviceDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const serviceTime = document.querySelector('input[name="service-time"]:checked').value

  // Get personal details
  const fullName = document.getElementById("full-name").value
  const email = document.getElementById("email").value
  const phone = document.getElementById("phone").value

  // Update summary with animation
  animateUpdateText("summary-service", serviceName)
  animateUpdateText("summary-price", servicePrice)
  animateUpdateText("summary-vehicle", `${vehicleMake} ${vehicleModel} (${vehicleYear})`)
  animateUpdateText("summary-license", licensePlate ? `License: ${licensePlate}` : "")
  animateUpdateText("summary-date", formattedDate)
  animateUpdateText("summary-time", serviceTime)
  animateUpdateText("summary-name", fullName)
  animateUpdateText("summary-email", email)
  animateUpdateText("summary-phone", phone)
}

function animateUpdateText(elementId, newText) {
  const element = document.getElementById(elementId)

  // Fade out
  element.style.transition = "opacity 0.3s ease"
  element.style.opacity = "0"

  // Update text and fade in
  setTimeout(() => {
    element.textContent = newText
    element.style.opacity = "1"
  }, 300)
}

function submitBooking() {
  // Show loading state
  const confirmButton = document.getElementById("confirm-booking")
  const originalText = confirmButton.textContent

  confirmButton.disabled = true
  confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'

  // Simulate API call with timeout
  setTimeout(() => {
    // Hide booking form with fade out
    const bookingForm = document.querySelector(".booking-form")
    bookingForm.style.transition = "opacity 0.5s ease"
    bookingForm.style.opacity = "0"

    setTimeout(() => {
      bookingForm.style.display = "none"

      // Generate random booking reference
      const bookingRef = "AC" + Math.floor(10000 + Math.random() * 90000)
      document.getElementById("booking-reference").textContent = bookingRef

      // Show confirmation with fade in
      const confirmation = document.getElementById("booking-confirmation")
      confirmation.style.display = "block"
      confirmation.style.opacity = "0"

      setTimeout(() => {
        confirmation.style.transition = "opacity 0.5s ease"
        confirmation.style.opacity = "1"

        // Add confetti effect
        createConfetti()

        // Scroll to top of confirmation
        confirmation.scrollIntoView({ behavior: "smooth" })
      }, 50)
    }, 500)
  }, 2000)
}

function createConfetti() {
  const confettiContainer = document.createElement("div")
  confettiContainer.className = "confetti-container"
  confettiContainer.style.position = "absolute"
  confettiContainer.style.top = "0"
  confettiContainer.style.left = "0"
  confettiContainer.style.width = "100%"
  confettiContainer.style.height = "100%"
  confettiContainer.style.pointerEvents = "none"
  confettiContainer.style.zIndex = "10"
  confettiContainer.style.overflow = "hidden"

  document.getElementById("booking-confirmation").appendChild(confettiContainer)

  const colors = ["#4f46e5", "#f97316", "#10b981", "#f59e0b", "#8b5cf6"]

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div")
    confetti.style.position = "absolute"
    confetti.style.width = Math.random() * 10 + 5 + "px"
    confetti.style.height = Math.random() * 5 + 3 + "px"
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.top = "-10px"
    confetti.style.left = Math.random() * 100 + "%"
    confetti.style.opacity = Math.random() + 0.5
    confetti.style.transform = "rotate(" + Math.random() * 360 + "deg)"

    confettiContainer.appendChild(confetti)

    // Animate confetti
    const duration = Math.random() * 3 + 2
    const delay = Math.random() * 2

    confetti.style.animation = `confetti-fall ${duration}s ease-in ${delay}s forwards`
  }

  // Add keyframes for confetti animation
  const style = document.createElement("style")
  style.innerHTML = `
        @keyframes confetti-fall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(600px) rotate(360deg);
                opacity: 0;
            }
        }
    `
  document.head.appendChild(style)

  // Remove confetti after animation
  setTimeout(() => {
    confettiContainer.remove()
  }, 5000)
}
