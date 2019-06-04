describe('ASLive mobile tests', () => {
	it('should show all components', () => {
		expect(browser.isVisible('#translation_station')).toBe(true);
		expect(browser.isVisible('#sendMessage')).toBe(true);
		expect(browser.isVisible('#asl_logo')).toBe(true);
	});

	it('Ensure text recieved', () => {
		browser.click('#sendMessage');
		await driver.setImplicitWaitTimeout(100);
		expect(browser.getElementText().isNot(''));
	});
});
