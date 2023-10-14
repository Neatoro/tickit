module.exports = class OverviewPage {

    constructor({ puppeteer }) {
        this.puppeteer = puppeteer;
    }

    async getTickets() {
        await this.puppeteer.page.waitForSelector('.table-list__element');

        const tickets = await this.puppeteer.page.evaluate(() => {
            const elements = [...document.querySelectorAll('.table-list__element')];

            return elements.map((element) => {
                const cells = [...element.querySelectorAll('td')];

                return {
                    id: cells[0].innerText,
                    type: cells[1].innerText,
                    summary: cells[2].innerText,
                    status: cells[3].innerText,
                    project: cells[4].innerText
                };
            })
        });

        return tickets;
    }

}
