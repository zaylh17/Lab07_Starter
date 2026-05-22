describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');
    let allArePopulated = true;
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        return data = item.data;
      });
    });

    for (let i = 0; i < prodItemsData.length; i++) {
      console.log(`Checking product item ${i + 1}/${prodItemsData.length}`);
      let currentValue = prodItemsData[i];
      if (currentValue.title.length == 0) { allArePopulated = false; }
      if (currentValue.price.length == 0) { allArePopulated = false; }
      if (currentValue.image.length == 0) { allArePopulated = false; }
    }

    expect(allArePopulated).toBe(true);
  }, 30000);

  // Check that clicking "Add to Cart" changes the button text to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    // Get the first <product-item>
    const productItem = await page.$('product-item');
    // Get its shadowRoot
    const shadowRoot = await productItem.getProperty('shadowRoot');
    // Find the button inside the shadowRoot
    const button = await shadowRoot.$('button');
    // Click the button
    await button.click();
    // Get the new innerText of the button
    const innerText = await button.getProperty('innerText');
    const buttonText = await innerText.jsonValue();

    expect(buttonText).toBe('Remove from Cart');
  }, 10000);

  // Click "Add to Cart" on all <product-item>s and check cart-count is 20
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    // Get all product items
    const productItems = await page.$$('product-item');

    // Loop through and click each one's button
    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const innerText = await button.getProperty('innerText');
      const buttonText = await innerText.jsonValue();

      // Only click if it currently says "Add to Cart"
      if (buttonText === 'Add to Cart') {
        await button.click();
      }
    }

    // Now check the cart-count element
    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(cartCount).toBe('20');
  }, 30000);

  // After reload, all buttons should still say "Remove from Cart" and cart-count should be 20
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    // Reload the page
    await page.reload();

    // Get all product items
    const productItems = await page.$$('product-item');

    // Verify each button says "Remove from Cart"
    let allRemove = true;
    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const innerText = await button.getProperty('innerText');
      const buttonText = await innerText.jsonValue();
      if (buttonText !== 'Remove from Cart') {
        allRemove = false;
      }
    }
    expect(allRemove).toBe(true);

    // Cart count should still be 20
    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(cartCount).toBe('20');
  }, 30000);

  // Check localStorage cart is [1,2,...,20]
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    // Get the 'cart' item from localStorage by running code in the browser
    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  // Remove every item from cart and check cart-count is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    // Get all product items
    const productItems = await page.$$('product-item');

    // Click each button - they should all say "Remove from Cart" now
    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const innerText = await button.getProperty('innerText');
      const buttonText = await innerText.jsonValue();

      // Only click if it currently says "Remove from Cart"
      if (buttonText === 'Remove from Cart') {
        await button.click();
      }
    }

    // Now cart count should be 0
    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(cartCount).toBe('0');
  }, 30000);

  // After reload, all buttons should say "Add to Cart" and cart-count should be 0
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    // Reload the page
    await page.reload();

    // Get all product items
    const productItems = await page.$$('product-item');

    // Verify each button says "Add to Cart"
    let allAdd = true;
    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const innerText = await button.getProperty('innerText');
      const buttonText = await innerText.jsonValue();
      if (buttonText !== 'Add to Cart') {
        allAdd = false;
      }
    }
    expect(allAdd).toBe(true);

    // Cart count should still be 0
    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(cartCount).toBe('0');
  }, 30000);

  // Check localStorage cart is '[]'
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    expect(cart).toBe('[]');
  });
});