document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const nav = document.querySelector("nav")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active")

      // Toggle icon between bars and times
      const icon = menuToggle.querySelector("i")
      if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  }

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      nav &&
      nav.classList.contains("active") &&
      !event.target.closest("nav") &&
      !event.target.closest(".menu-toggle")
    ) {
      nav.classList.remove("active")

      const icon = menuToggle.querySelector("i")
      icon.classList.remove("fa-times")
      icon.classList.add("fa-bars")
    }
  })

  // Testimonial slider auto-scroll
  const testimonialSlider = document.querySelector(".testimonial-slider")
  if (testimonialSlider) {
    const testimonials = testimonialSlider.querySelectorAll(".testimonial")
    let currentIndex = 0

    function scrollToNextTestimonial() {
      currentIndex = (currentIndex + 1) % testimonials.length
      testimonials[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      })
    }

    // Auto scroll every 5 seconds
    setInterval(scrollToNextTestimonial, 5000)
  }

  // Add animations to elements when they come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".feature-card, .service-card, .testimonial, .cta h2, .cta p, .cta .btn-primary",
    )

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const screenPosition = window.innerHeight / 1.2

      if (elementPosition < screenPosition) {
        element.classList.add("animate")
      }
    })
  }

  // Run animation check on scroll
  window.addEventListener("scroll", animateOnScroll)
  // Run once on page load
  animateOnScroll()

  // Auth tabs
  const authTabs = document.querySelectorAll(".auth-tab")
  if (authTabs.length > 0) {
    authTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs and forms
        document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"))
        document.querySelectorAll(".auth-form").forEach((f) => f.classList.remove("active"))

        // Add active class to clicked tab
        this.classList.add("active")

        // Show corresponding form
        const formId = this.getAttribute("data-tab") + "-form"
        document.getElementById(formId).classList.add("active")
      })
    })
  }

  // Password visibility toggle
  const passwordFields = document.querySelectorAll('input[type="password"]')
  passwordFields.forEach((field) => {
    const parent = field.parentElement

    // Create toggle button
    const toggleBtn = document.createElement("button")
    toggleBtn.type = "button"
    toggleBtn.className = "password-toggle"
    toggleBtn.innerHTML = '<i class="fas fa-eye"></i>'
    toggleBtn.style.position = "absolute"
    toggleBtn.style.right = "15px"
    toggleBtn.style.top = "50%"
    toggleBtn.style.transform = "translateY(-50%)"
    toggleBtn.style.background = "none"
    toggleBtn.style.border = "none"
    toggleBtn.style.cursor = "pointer"
    toggleBtn.style.color = "#64748b"

    // Add toggle button to parent
    if (parent.classList.contains("input-icon")) {
      parent.appendChild(toggleBtn)

      // Toggle password visibility
      toggleBtn.addEventListener("click", () => {
        const type = field.getAttribute("type") === "password" ? "text" : "password"
        field.setAttribute("type", type)

        // Toggle icon
        const icon = toggleBtn.querySelector("i")
        if (type === "text") {
          icon.classList.remove("fa-eye")
          icon.classList.add("fa-eye-slash")
        } else {
          icon.classList.remove("fa-eye-slash")
          icon.classList.add("fa-eye")
        }
      })
    }
  })

  // Highlight current page in navigation
  const currentLocation = window.location.pathname
  const navLinks = document.querySelectorAll("nav ul li a")
  navLinks.forEach((link) => {
    if (
      link.getAttribute("href") === currentLocation ||
      (currentLocation.includes(link.getAttribute("href")) && link.getAttribute("href") !== "index.html")
    ) {
      link.classList.add("active")
    }
  })

  // Add subtle hover effects to buttons
  const buttons = document.querySelectorAll(".btn-primary, .btn-secondary, .btn-outline")
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)"
      this.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)"
    })

    button.addEventListener("mouseleave", function () {
      this.style.transform = ""
      this.style.boxShadow = ""
    })
  })
})
