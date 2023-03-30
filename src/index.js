import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { RestcountriesAPI } from './fetchCountries.js';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const renderCountryInfo = country => {
  const { name, capital, flags, population, languages } = country;
  countryInfoEl.innerHTML = `
    <div class="country-info__text">
    <img src="${flags.svg}" alt="${name.common} flag" width=80>
      <h2 class="country-info__title">${name.official}</h2>
      <p><span class="country-info__label">Capital:</span> ${capital}</p>
      <p><span class="country-info__label">Population:</span> ${population}</p>
      <p><span class="country-info__label">Languages:</span> ${Object.values(
        languages
      ).join(', ')}</p>
    </div>
  `;
};

const renderCountryList = countries => {
  const listItems = countries
    .map(country => {
      const { name, flags, alt } = country;
      return `
          <li class="country-list__item" data-name="${name.common}">
            <img src="${flags.svg}" alt="${alt}" class="country-list__img" width=80 />
            <p class="country-list__text">${name.official}</p>
          </li>
        `;
    })
    .join('');
  countryListEl.innerHTML = `<ul class="country-list">${listItems}</ul>`;
};

const countriesApi = new RestcountriesAPI();

const handleInputValue = event => {
  const searchQuery = event.target.value.toLowerCase().trim();
  countriesApi
    .fetchCountries()
    .then(countries => {
      const matchingCountries = countries.filter(country => {
        const name = country.name.common.toLowerCase().trim();
        return name.startsWith(searchQuery);
      });

      if (matchingCountries.length === 0) {
        countryInfoEl.textContent = '';
        countryListEl.textContent = '';
        Notify.failure('Oops, there is no country with that name');
      } else if (
        matchingCountries.length >= 2 &&
        matchingCountries.length <= 10
      ) {
        renderCountryList(matchingCountries);
        countryInfoEl.textContent = '';
      } else if (
        (matchingCountries.length === 1 &&
          matchingCountries[0].name.common
            .toLowerCase()
            .startsWith(searchQuery)) ||
        matchingCountries[0].name.common.toLowerCase() === searchQuery
      ) {
        renderCountryInfo(matchingCountries[0]);
        countryListEl.textContent = '';
      } else {
        countryInfoEl.textContent = '';
        countryListEl.textContent = '';
        Notify.info(
          'Too many matches found. Please type a more specific query.'
        );
      }
    })
    .catch(error => {
      console.warn(error);
    });

  if (searchQuery.length === 0) {
    countryListEl.textContent = '';
    countryInfoEl.textContent = '';
  }
};

inputEl.addEventListener('input', debounce(handleInputValue, DEBOUNCE_DELAY));
