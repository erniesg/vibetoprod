import { chromium } from 'playwright';

async function debugStreaming() {
  console.log('🚀 Starting streaming debug session...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen to console logs
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('🔍') || text.includes('📦') || text.includes('🔗') || text.includes('✅') || text.includes('📊') || 
        text.includes('🎯') || text.includes('⏳') || text.includes('❌') || text.includes('fitView') || 
        text.includes('nodes initialized') || text.includes('fitting view') || text.includes('🔧')) {
      console.log(`BROWSER: ${text}`);
    }
  });
  
  // Also listen to errors
  page.on('pageerror', err => {
    console.log(`PAGE ERROR: ${err.message}`);
  });
  
  // Navigate to streaming mode
  await page.goto('http://localhost:5173/?streaming=true');
  
  // Wait for page to load
  await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
  
  console.log('✅ Page loaded, taking initial screenshot...');
  await page.screenshot({ path: 'debug-initial.png' });
  
  // Scroll down to find the form
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'debug-scrolled.png' });
  
  // Fill required form fields to enable submit button
  try {
    // Fill app description (this is likely required)
    await page.fill('textarea', 'E-commerce platform for testing viewport behavior');
    
    // Wait a bit for the form to validate
    await page.waitForTimeout(1000);
    
    // Try to click the submit button to start streaming
    await page.click('button[type="submit"]');
    console.log('✅ Started streaming...');
    
  } catch (error) {
    console.log('❌ Error starting streaming:', error.message);
    
    // Let's also take a screenshot to see what's happening
    await page.screenshot({ path: 'debug-error-state.png' });
    return;
  }
  
  // Scroll to the diagrams section
  await page.evaluate(() => {
    const diagramSection = document.querySelector('.react-flow');
    if (diagramSection) {
      diagramSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, window.innerHeight);
    }
  });
  
  await page.waitForTimeout(1000);
  
  // Take screenshots at intervals
  const screenshots = [];
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(1000);
    const filename = `debug-streaming-${i + 1}.png`;
    await page.screenshot({ path: filename });
    screenshots.push(filename);
    
    // Check node count
    const nodeCount = await page.evaluate(() => {
      const panels = document.querySelectorAll('[data-testid="diagram-node"]');
      return panels.length;
    });
    
    console.log(`📸 Screenshot ${i + 1}: ${nodeCount} nodes visible`);
    
    // If streaming is complete, break
    const isComplete = await page.evaluate(() => {
      const streamingIndicator = document.querySelector('[data-testid="streaming-indicator"]');
      return !streamingIndicator || streamingIndicator.style.display === 'none';
    });
    
    if (isComplete) {
      console.log('✅ Streaming completed at screenshot', i + 1);
      break;
    }
  }
  
  console.log('📸 Screenshots captured:', screenshots);
  
  // Keep browser open for manual inspection
  console.log('🔍 Browser staying open for manual inspection...');
  await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
  
  await browser.close();
}

debugStreaming().catch(console.error);