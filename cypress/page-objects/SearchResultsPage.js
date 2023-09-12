/// <reference types='Cypress'>

import { expect } from "chai";

export default class SearchResultsPage {

    static selectedFilter = 'span.facet-tag'
    
    static identifyAllCountriesCount() {
        let locationSet = new Set();
        let countryList = [];
        let numberOfResultPages = 0;
        this.getResultsCount().then((count) => {
            numberOfResultPages =  Math.ceil(count.text() / 10);
        });
        cy.then(()=> {
            for(let counter = 1; counter <= numberOfResultPages; counter++) {
                cy.get(`ul.pagination li a:contains("${counter}"):first`).click({force:true});
                cy.get('.job-location').each((entry) => {
                    const text = entry.text().replace('Location', '').trim();
                    if(text != '') {
                        locationSet.add(text);
                        countryList.push(text);
                      }
                  });
              }
        });
        cy.then(() => {
            const size = String(locationSet.size);
            cy.wrap(size).as('size');
            cy.wrap(locationSet).as('countryList');
            cy.wrap(countryList).as('countries');
        });
    }

    static verifyAllSearchResultsContainSearchTerm(searchTerm) {
        let numberOfResultPages = 0;
        cy.get('body').within(() => {
            cy.get('.ph-loading > img').should('not.exist');
            this.getResultsCount().then((count) => {
                numberOfResultPages = Math.ceil(count.text() / 10);
                for(let counter = 1; counter <= numberOfResultPages; counter++) {
                    cy.get(`ul.pagination li a:contains("${counter}"):first`).click({force:true});
                    cy.get('span.au-target.category').each((entry) => {
                        const text = entry.text().replace('Category', '').trim();
                        expect(text).to.include(searchTerm);
                      });
                  }
            });
        });
    }

    static getSelectedFilter() {
        return cy.get(this.selectedFilter);
    }

    static getResultsCount() {
        return cy.get('.result-count');
    }

    static getActualSearchResultsCount() {
        let numberOfResultPages = 0;
        let actualCounter = 0;
        this.getResultsCount().then((count) => {
            cy.wrap(parseInt(count.text())).as('topResultsCount');
            numberOfResultPages = Math.ceil(count.text() / 10);
            for(let counter = 1; counter <= numberOfResultPages; counter++) {
                cy.get(`ul.pagination li a:contains("${counter}"):first`).click({force:true});
                cy.get('li.jobs-list-item').then((list) => {
                    actualCounter+=list.length;
                    if(counter == numberOfResultPages) {
                        cy.wrap(actualCounter).as('actualResultCount');
                    }
                  });
              }
        })    
    }

}