import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <header class="header">
      <h1>🚀 欢迎来到我的网站</h1>
      <p class="subtitle">现代化的网页设计体验</p>
    </header>
    
    <main class="main">
      <section class="hero">
        <div class="hero-content">
          <h2>精美的设计</h2>
          <p>这是一个快速搭建的现代化网站，具有优雅的设计和流畅的交互体验。</p>
          <button class="cta-button" id="cta">开始探索</button>
        </div>
      </section>
      
      <section class="features">
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>快速加载</h3>
            <p>使用现代化的构建工具，确保网站快速加载</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>精美设计</h3>
            <p>采用现代设计理念，提供优雅的视觉体验</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>响应式</h3>
            <p>完美适配各种设备，从手机到桌面</p>
          </div>
        </div>
      </section>
    </main>
    
    <footer class="footer">
      <p>&copy; 2025 快速网站. 所有权利保留.</p>
    </footer>
  </div>
`

// 添加交互功能
document.getElementById('cta').addEventListener('click', () => {
  alert('欢迎探索我们的网站！🎉')
})