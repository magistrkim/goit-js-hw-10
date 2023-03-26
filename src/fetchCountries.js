export class RestcountriesAPI {
  #BASE_URL = 'https://restcountries.com/v3.1';
  #BASE_SEARCH_PARAMS = {
    fields: 'name, capital, flags, population, languages',
  };

  fetchCountries() {
    const url = `${this.#BASE_URL}/all?fields = ${new URLSearchParams(
      this.#BASE_SEARCH_PARAMS
    )}`;

    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        return data;
      });
  }
}
