document.addEventListener("DOMContentLoaded", () => {
  // Initialize dashboard components
  initNotifications()
  initCharts()

  // Handle sidebar navigation on mobile
  const sidebarLinks = document.querySelectorAll(".sidebar-nav ul li a")
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // Remove active class from all links
      sidebarLinks.forEach((l) => l.parentElement.classList.remove("active"))

      // Add active class to clicked link
      this.parentElement.classList.add("active")
    })
  })
})

function initNotifications() {
  const notificationIcon = document.querySelector(".notifications")
  if (notificationIcon) {
    notificationIcon.addEventListener("click", () => {
      // Simulate notification panel toggle
      alert("Notifications feature will be implemented in the next phase.")
    })
  }
}

function initCharts() {
  // This function would initialize charts if we were using a charting library
  // For now, it's a placeholder for future implementation
  // Example implementation with Chart.js would look like:
  /*
    if (typeof Chart !== 'undefined') {
        // Service History Chart
        const serviceHistoryCtx = document.getElementById('serviceHistoryChart');
        if (serviceHistoryCtx) {
            new Chart(serviceHistoryCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Service Visits',
                        data: [1, 0, 2, 1, 1, 0],
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            stepSize: 1
                        }
                    }
                }
            });
        }
        
        // Expense Chart
        const expenseChartCtx = document.getElementById('expenseChart');
        if (expenseChartCtx) {
            new Chart(expenseChartCtx, {
                type: 'pie',
                data: {
                    labels: ['Oil Change', 'Brake Service', 'Tire Service', 'Other'],
                    datasets: [{
                        data: [30, 40, 20, 10],
                        backgroundColor: [
                            'rgba(52, 152, 219, 0.7)',
                            'rgba(46, 204, 113, 0.7)',
                            'rgba(155, 89, 182, 0.7)',
                            'rgba(243, 156, 18, 0.7)'
                        ],
                        borderColor: [
                            'rgba(52, 152, 219, 1)',
                            'rgba(46, 204, 113, 1)',
                            'rgba(155, 89, 182, 1)',
                            'rgba(243, 156, 18, 1)'
                        ],
                        borderWidth: 1
                    }]
                }
            });
        }
    }
    */
}

// Function to handle appointment actions
function rescheduleAppointment(appointmentId) {
  // Redirect to booking page with appointment data
  window.location.href = `booking.html?reschedule=${appointmentId}`
}

function cancelAppointment(appointmentId) {
  if (confirm("Are you sure you want to cancel this appointment?")) {
    // Simulate API call
    alert("Appointment cancelled successfully.")

    // In a real application, we would make an API call and then update the UI
    // For demo purposes, we'll just reload the page
    window.location.reload()
  }
}

// Function to handle vehicle actions
function editVehicle(vehicleId) {
  window.location.href = `edit-vehicle.html?id=${vehicleId}`
}

function deleteVehicle(vehicleId) {
  if (confirm("Are you sure you want to delete this vehicle?")) {
    // Simulate API call
    alert("Vehicle deleted successfully.")

    // In a real application, we would make an API call and then update the UI
    // For demo purposes, we'll just reload the page
    window.location.reload()
  }
}
