/// <reference types='Cypress'>

import { expect } from "chai";
import HomePage from "../page-objects/HomePage";
import SearchResultsPage from "../page-objects/SearchResultsPage";

describe('JET Test suite', () => {
  beforeEach(function() {
    cy.fixture('testData').as('data');
    cy.visit('https://careers.justeattakeaway.com/global/en/home');
    HomePage.denyCookiesIfAsked();
  })

  it('TC 1', function() {
    HomePage
    .enterJobTitle(this.data.title)
    .executeSearch();
    SearchResultsPage.identifyAllCountriesCount();
    cy.then(() => {
      cy.get('@size')
        .then((size) => {
          const count = parseInt(size);
          //First check - search contains results from multiple locations
           expect(count).to.be.greaterThan(1);
      });
    });

    HomePage.filterWithCountry(this.data.netherlands);
    //Second check - verifying if Netherlands filter is shown at the top
    SearchResultsPage.getSelectedFilter()
    .then((filter) => {
      expect(filter.text()).to.equal(this.data.netherlands);
      cy.wrap(filter).should('have.length', 1);
    }); 

    SearchResultsPage.identifyAllCountriesCount();
    cy.then(() => {
      cy.get('@size')
        .then((size) => {
          const count = parseInt(size);
          //Third check- verifying if the country count is 1, only Netherlands
           expect(count).to.equal(1);
           cy.get('@countries').then((list) => {
              list.forEach(element => {
                //Fourth check - All jobs should be posted in Netherlands
                  expect(element).to.include(this.data.netherlands);
              });
           });
      });
    });
  });

  it('TC 2', function() {
    HomePage
      .clickOnJobTitle()
      .selectJobCategory(this.data.sales);
    HomePage.scrollToRefineYourSearch();
    SearchResultsPage.getSelectedFilter()
       .then((filter) => {
      //First check - verify that the selected Sales filter is shown
      expect(filter.text()).to.equal(this.data.sales);
      cy.wrap(filter).should('have.length', 1);
    }); 
    //Second check - Verify only the Sales jobs are shown
    SearchResultsPage.getActualSearchResultsCount();
    cy.get('@actualResultCount').then((count) => {
      const actualResultCount = parseInt(count);
      cy.get('@topResultsCount').then((countAtTop) => {
        const topCount = parseInt(countAtTop);
        expect(topCount).to.equal(actualResultCount);
      });
    });
    HomePage.filterWithCountry(this.data.germany);
    SearchResultsPage.getSelectedFilter()
    .then((filter) => {
      //Confirmation that 2 filters are selected 
      cy.wrap(filter).should('have.length', 2);
    });
    //Confirmation that only Sales job are shown after applying both filters
    SearchResultsPage.verifyAllSearchResultsContainSearchTerm(this.data.sales);
  });
});