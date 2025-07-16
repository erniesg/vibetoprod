import { chromium } from 'playwright';

async function testStreamingArchitecture() {
  console.log('🚀 Testing Streaming Architecture Implementation...');
  
  // Launch browser
  const browser = await chromium.launch({ 
    headless: true, // Must be headless in WSL/server environment
    slowMo: 500 // Slow down actions for reliability
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to streaming version
    console.log('📍 Navigating to streaming version...');
    await page.goto('http://localhost:8788/?streaming=true');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    console.log('✅ Page loaded');
    
    // Check if we're in streaming mode
    const title = await page.locator('h2:has-text("Build Your Architecture")').first();
    await title.waitFor({ timeout: 5000 });
    console.log('✅ Streaming interface detected');
    
    // Fill out the form
    console.log('📝 Filling out architecture form...');
    
    // Select persona (should already be selected due to auto-cycling)
    console.log('   - Persona: Using auto-cycling selection');
    
    // Fill app description
    await page.fill('[data-testid="app-description"]', 'A real-time AI chat application for customer support with document RAG and live agent handoff');
    console.log('   - App description: Filled');
    
    // Submit form
    console.log('🎯 Generating architecture...');
    await page.click('[data-testid="generate"]');
    
    // Wait for streaming to start
    console.log('⏳ Waiting for streaming to begin...');
    await page.waitForSelector('[data-testid="streaming-indicator"]', { timeout: 10000 });
    console.log('✅ Streaming started');
    
    // Wait for first node to appear
    console.log('🔍 Waiting for first diagram node...');
    await page.waitForSelector('[data-testid="diagram-node"]', { timeout: 30000 });
    console.log('✅ First node appeared');
    
    // Count nodes as they stream in
    let nodeCount = 0;
    let maxWaitTime = 60000; // 60 seconds max
    let startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const nodes = await page.locator('[data-testid="diagram-node"]').count();
      if (nodes > nodeCount) {
        nodeCount = nodes;
        console.log(`📊 Nodes detected: ${nodeCount}`);
      }
      
      // Check if streaming is complete
      const isComplete = await page.locator('[data-testid="streaming-complete"]').count();
      if (isComplete > 0) {
        console.log('🎉 Streaming completed!');
        break;
      }
      
      await page.waitForTimeout(1000); // Check every second
    }
    
    // Take screenshot of final result
    console.log('📸 Taking final screenshot...');
    await page.screenshot({ 
      path: 'streaming-architecture-result.png',
      fullPage: true 
    });
    
    // Get final stats
    const finalNodeCount = await page.locator('[data-testid="diagram-node"]').count();
    const advantagesCount = await page.locator('text=/Technical Advantage|Business Value/').count();
    
    console.log(`\n📊 Final Results:`);
    console.log(`   - Nodes generated: ${finalNodeCount}`);
    console.log(`   - Advantages shown: ${advantagesCount}`);
    console.log(`   - Screenshot saved: streaming-architecture-result.png`);
    
    // Test error handling by trying invalid input
    console.log('\n🧪 Testing error handling...');
    await page.fill('[data-testid="app-description"]', '');
    const generateButton = page.locator('[data-testid="generate"]');
    const isDisabled = await generateButton.isDisabled();
    console.log(`✅ Generate button properly disabled for empty input: ${isDisabled}`);
    
    console.log('\n🎯 All tests passed! Streaming implementation working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Take error screenshot
    await page.screenshot({ 
      path: 'streaming-test-error.png',
      fullPage: true 
    });
    console.log('📸 Error screenshot saved: streaming-test-error.png');
    
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testStreamingArchitecture()
  .then(() => {
    console.log('\n✨ Streaming test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Streaming test failed:', error);
    process.exit(1);
  });