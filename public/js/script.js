// Theme switching functionality
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  const themeSelect = document.getElementById('themeSelect');
  const html = document.documentElement;
  
  // Get saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-bs-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  // Set the theme select value if it exists
  if (themeSelect) {
    themeSelect.value = savedTheme;
  }
  
  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = html.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      
      if (themeSelect) {
        themeSelect.value = newTheme;
      }
    });
  }
  
  // Change theme from select dropdown
  if (themeSelect) {
    themeSelect.addEventListener('change', function() {
      const newTheme = this.value;
      html.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
  
  function updateThemeIcon(theme) {
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (theme === 'dark') {
        icon.className = 'bi bi-sun-fill';
      } else {
        icon.className = 'bi bi-moon-fill';
      }
    }
  }
  
  // Show loading spinner on page navigation
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      // Don't show spinner for external links or links with specific classes
      if (this.href && this.href.startsWith(window.location.origin) && 
          !this.classList.contains('no-spinner')) {
        document.getElementById('loadingSpinner').classList.remove('d-none');
      }
    });
  });
  
  // Hide spinner when page is fully loaded
  window.addEventListener('load', function() {
    document.getElementById('loadingSpinner').classList.add('d-none');
  });
});