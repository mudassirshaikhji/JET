/// <reference types='Cypress'>

export default class HomePage {

    static jobTitleTextField = 'input#keywordSearch';
    static searchButton = 'button#ph-search-backdrop';
    static countryFilter = 'button#CountryAccordion';
    static salesCategory = 'span:contains("Sales")';

    static denyCookiesIfAsked() { 
        cy.get('body')
            .then(body => {
                const titleHomePage =Cypress.$('div.phs-cookie-popup-area');
                if(titleHomePage.length) {
                    cy.get('button:contains("Deny")').click();
                }
            })
    }

    static enterJobTitle(title) {
        cy.get(this.jobTitleTextField).type(title);
        return this;
    }

    static executeSearch() {
        cy.get(this.searchButton).click();
        return this;
    }

    static filterWithCountry(country) {
        cy.get(this.countryFilter)
            .click();
        cy.get(`span.result-text:contains("${country}")`)
            .click();
    } 

    static clickOnJobTitle() {
        cy.get(this.jobTitleTextField).click();
        return this;
    }

    static selectJobCategory(category) {
        cy.get('ul[data-ph-at-id="category-list"]')
        .find(this.salesCategory)
            .scrollIntoView()
            .click();
    }

    static scrollToRefineYourSearch() {
        cy.get('h2[title="Refine your search results by below filters"]')
            .scrollIntoView();
    }
}