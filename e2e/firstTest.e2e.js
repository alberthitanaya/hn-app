const { reloadApp } = require('detox-expo-helpers');

describe('Example', () => {
  beforeEach(async () => {
    await reloadApp({
      launchArgs: { 'DTXEnableVerboseSyncSystem': 'YES', 'DTXEnableVerboseSyncResources': 'YES' }
    });
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('DashboardScreen'))).toBeVisible();
  });
});
