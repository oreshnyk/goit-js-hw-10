import './css/styles.css';
import {fetchCountries} from "./fetchCountries"
import { Notify } from 'notiflix/build/notiflix-notify-aio'
import "notiflix/dist/notiflix-3.2.5.min.css"
import debounce from "lodash.debounce"

const DEBOUNCE_DELAY = 300;


const searchBox = document.querySelector("#search-box")
const countryList = document.querySelector(".country-list")
const countryInfo = document.querySelector(".country-info")

const onKeyDown = (event) => {
    const searchStr = event.target.value.trim()
    if(searchStr === ''){
        countryList.innerHTML = ''
        countryInfo.innerHTML = ''
        return 
    }
    fetchCountries(searchStr)
    .then(data => {
        if(data.length > 10){
            Notify.info("Too many matches found. Please enter a more specific name.")
            return 
        }
        let index = data.findIndex(elem => elem.name.official.toUpperCase() === searchStr.toUpperCase())
        if(data.length < 10 
                && data.length > 1
                && index === -1){
            countryInfo.innerHTML = ''
            countryList.innerHTML = data
                .map(elem => `<li><img src="${elem.flags.svg}" alt="flag" width="20"> <span>${elem.name.official}</span></li>`)
                .join('')
            return
        }
        if (index === -1){
            index = 0
        }
        const country = data[index]
        countryList.innerHTML = ''
        countryInfo.innerHTML = `<img src="${country.flags.svg}" alt="flag" width="100">`
        +`<h1>${country.name.official}</h1>`
        +`<dl>`
        +`<dt>Capital:</dt><dd>${country.capital.join(", ")}</dd>`
        +`<dl><dt>Population:</dt><dd>${country.population}</dd>`
        +`<dl><dt>Languages:</dt><dd>${Object.keys(country.languages).map(key => country.languages[key]).join(", ")}</dd>`
        +`</dl>`
    })
    .catch(error => {
        countryList.innerHTML = ''
        countryInfo.innerHTML = ''
        if (error.toString().indexOf("404") >= 0){
            Notify.failure("Oops, there is no country with that name")
            return
        }
        Notify.failure("Oops, unknown error happens - look in console")
        console.log(error)
    });
}

searchBox.addEventListener("keydown", debounce(onKeyDown, DEBOUNCE_DELAY))