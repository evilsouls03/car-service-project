document.addEventListener("DOMContentLoaded", () => {
  // Form validation
  const loginForm = document.querySelector("#login-form form")
  const registerForm = document.querySelector("#register-form form")

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const email = document.getElementById("login-email")
      const password = document.getElementById("login-password")

      if (validateLoginForm(email, password)) {
        // Simulate form submission
        simulateFormSubmission(this, "login")
      }
    })
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const name = document.getElementById("register-name")
      const email = document.getElementById("register-email")
      const phone = document.getElementById("register-phone")
      const password = document.getElementById("register-password")
      const confirmPassword = document.getElementById("register-confirm-password")
      const terms = document.getElementById("terms-agree")

      if (validateRegisterForm(name, email, phone, password, confirmPassword, terms)) {
        // Simulate form submission
        simulateFormSubmission(this, "register")
      }
    })
  }
})

function validateLoginForm(email, password) {
  let isValid = true

  // Validate email
  if (!validateField(email)) {
    isValid = false
  }

  // Validate password
  if (!validateField(password)) {
    isValid = false
  }

  return isValid
}

function validateRegisterForm(name, email, phone, password, confirmPassword, terms) {
  let isValid = true

  // Validate name
  if (!validateField(name)) {
    isValid = false
  }

  // Validate email
  if (!validateField(email)) {
    isValid = false
  }

  // Validate phone
  if (!validateField(phone)) {
    isValid = false
  }

  // Validate password
  if (!validateField(password)) {
    isValid = false
  }

  // Validate confirm password
  if (!validateField(confirmPassword)) {
    isValid = false
  }

  // Check if passwords match
  if (password.value !== confirmPassword.value) {
    showError(confirmPassword, "Passwords do not match")
    isValid = false
  }

  // Check terms agreement
  if (!terms.checked) {
    alert("Please agree to the Terms of Service and Privacy Policy")
    isValid = false
  }

  return isValid
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

  // Validate password strength
  if (fieldName === "password" && fieldValue.length < 8) {
    showError(field, "Password must be at least 8 characters long")
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

  // Create error message element
  const errorElement = document.createElement("div")
  errorElement.className = "error-message"
  errorElement.textContent = message
  errorElement.style.color = "var(--danger-color)"
  errorElement.style.fontSize = "0.8rem"
  errorElement.style.marginTop = "5px"

  // Add error message after the field
  const parent = field.parentElement
  parent.appendChild(errorElement)
}

function simulateFormSubmission(form, type) {
  // Get submit button
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent

  // Show loading state
  submitBtn.disabled = true
  submitBtn.textContent = "Processing..."

  // Simulate API call with timeout
  setTimeout(() => {
    if (type === "login") {
      // Redirect to dashboard after successful login
      window.location.href = "dashboard.html"
    } else {
      // Show success message after registration
      form.innerHTML = `
                <div class="registration-success">
                    <div class="success-icon">
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success-color);"></i>
                    </div>
                    <h3 style="margin: 15px 0;">Registration Successful!</h3>
                    <p style="margin-bottom: 20px;">Your account has been created successfully.</p>
                    <p style="margin-bottom: 20px;">A verification email has been sent to your email address. Please verify your email to activate your account.</p>
                    <button type="button" class="btn-primary btn-block" onclick="window.location.href='login.html'">Proceed to Login</button>
                </div>
            `
    }
  }, 2000)
}
