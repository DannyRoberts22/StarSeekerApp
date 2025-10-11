describe('Gates Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display the gates list on home screen', async () => {
    await waitFor(element(by.id('gate-item')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should allow pull to refresh', async () => {
    await waitFor(element(by.id('gate-item')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('gates-list')).swipe('down', 'fast', 0.75);

    await waitFor(element(by.id('gate-item')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should navigate to gate detail when tapping a gate item', async () => {
    await waitFor(element(by.id('gate-item')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('gate-item')).atIndex(0).tap();

    await waitFor(element(by.id('gate-detail-screen')))
      .toBeVisible()
      .withTimeout(3000);
  });
});
