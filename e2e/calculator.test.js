describe('Calculator Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id('tab-calculator')).tap();
    await waitFor(element(by.id('calculator-screen')))
      .toBeVisible()
      .withTimeout(2000);
  });

  it('should display the calculator screen', async () => {
    expect(element(by.id('calculator-screen'))).toBeVisible();
  });

  it('should allow selecting a gate from picker', async () => {
    expect(element(by.id('gate-picker'))).toBeVisible();

    await element(by.id('gate-picker')).tap();
  });

  it('should allow entering gate values', async () => {
    const inputField = element(by.id('gate-input-field'));
    expect(inputField).toBeVisible();

    await inputField.typeText('100');

    expect(inputField).toHaveText('100');
  });
});
