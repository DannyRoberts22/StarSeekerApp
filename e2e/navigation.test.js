describe('Navigation', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate between tabs', async () => {
    await waitFor(element(by.id('gate-item')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('tab-calculator')).tap();
    await waitFor(element(by.id('calculator-screen')))
      .toBeVisible()
      .withTimeout(2000);

    await element(by.id('tab-route')).tap();
    await waitFor(element(by.id('route-screen')))
      .toBeVisible()
      .withTimeout(2000);

    await element(by.id('tab-memory')).tap();
    await waitFor(element(by.id('memory-screen')))
      .toBeVisible()
      .withTimeout(2000);

    await element(by.id('tab-home')).tap();
    await waitFor(element(by.id('gate-item')))
      .toBeVisible()
      .withTimeout(2000);
  });
});
