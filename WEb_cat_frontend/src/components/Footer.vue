<template>
  <footer class="footer">
    <div class="footer-main">
      <div class="footer-brand">
        <router-link to="/" class="footer-logo">
          <div class="footer-logo-icon">M</div>
          <span>MEOWASSIST.</span>
        </router-link>
        <p class="footer-slogan">
          A MINIMALIST EXPERIMENT IN AI COMPANIONSHIP.<br>
          DESIGNED FOR CAT LOVERS & AESTHETICS SEEKERS.
        </p>
      </div>
      
      <div class="footer-links">
        <div class="footer-column">
          <h4>PLATFORM</h4>
          <ul>
            <li><router-link to="/archives">Profiles</router-link></li>
            <li><router-link to="/chat">AI Chat</router-link></li>
            <li><a href="#">Lab</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h4>COMPANY</h4>
          <ul>
            <li><router-link to="/about">About</router-link></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">Privacy</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h4>SOCIAL</h4>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Twitter</a></li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>© 2026 MEOWASSIST COLLECTIVE</p>
      <p>MINIMALISM IS CLARITY</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #FFFCF9;
  color: #1A1A1A;
  border-top: 2px solid #1A1A1A;
}

.footer-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.footer-brand {
  max-width: 400px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #1A1A1A;
  margin-bottom: 1.5rem;
}

.footer-logo-icon {
  width: 32px;
  height: 32px;
  background: #FF9E66;
  border: 2px solid #1A1A1A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.875rem;
}

.footer-logo span {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.footer-slogan {
  font-size: 0.75rem;
  line-height: 1.8;
  letter-spacing: 0.1em;
  opacity: 0.6;
  text-transform: uppercase;
}

.footer-links {
  display: flex;
  gap: 6rem;
}

.footer-column h4 {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

.footer-column ul {
  list-style: none;
}

.footer-column li {
  margin-bottom: 0.75rem;
}

.footer-column a {
  color: #1A1A1A;
  text-decoration: none;
  font-size: 0.875rem;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.footer-column a:hover {
  opacity: 1;
}

.footer-bottom {
  border-top: 1px solid rgba(26, 26, 26, 0.1);
  padding: 1.5rem 3rem;
  display: flex;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-bottom p {
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  opacity: 0.5;
  text-transform: uppercase;
}

@media (max-width: 968px) {
  .footer-main {
    flex-direction: column;
    gap: 3rem;
    padding: 3rem 1.5rem;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 2rem;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
    padding: 1.5rem;
  }
}
</style>
