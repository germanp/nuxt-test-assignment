<template>
  <div id="page-index" class="page page-index">
    <b-container>
      <b-row>
        <b-col>
          <vue-bootstrap-typeahead v-model="newCity" :data="allCities" :serializer="s => s.city" />
        </b-col>
        <b-col>
          <b-button @click="add" variant="primary">
            Add
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-for="card in cards" :key="card.city">
          <b-card :title="card.city" :sub-title="card.summary" class="text-center">
            <skycon :condition="card.icon" width="40" height="40" />
            <b-card-text>{{ card.temperature }}</b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

    <b-modal
      :ok-only="true"
      v-model="errorOpened"
      header-bg-variant="warning"
    >
      No matching city, please be sure to complete the full name.
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { State } from 'vuex-class'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead/src/components/VueBootstrapTypeahead.vue'
import DarkSkyApi from 'dark-sky-api'

interface City {
  city: string;
  latitude: number;
  longitude: number;
  state: string;
}

interface WeatherCard {
  city: string;
  summary: string;
  icon: string;
  temperature: string;
}
// FORECAST API KEY //
DarkSkyApi.apiKey = 'd386ebd12a182116dc3d25b074bfbcf4'
// //

@Component({
  components: {
    VueBootstrapTypeahead
  }
})
export default class PageIndex extends Vue {
  @State(state => state.Example.cities) allCities!: City[];
  newCity = '';
  errorOpened = false;
  cities: string[] = []
  cards: WeatherCard[] = [];

  // We can't use a computed property because it retrieves async data
  async getCards() {
    const promisedCards = this.cities.map(async (city) => {
      const matchingCity = this.allCities.find(c => c.city === city)
      if (!matchingCity) {
        throw new Error('Unexpected error, Could not find a matching city')
      }
      const forecast = await DarkSkyApi.loadCurrent({
        latitude: matchingCity.latitude, longitude: matchingCity.longitude
      })

      return {
        city,
        summary: forecast.summary,
        icon: forecast.icon,
        temperature: forecast.temperature
      }
    })
    this.cards = await Promise.all(promisedCards)
  }

  async add() {
    const matchingCity = this.allCities.find(c => c.city === this.newCity)

    if (!matchingCity) {
      this.errorOpened = true
    } else {
      const cities = [...this.cities, this.newCity]
      this.cities = cities
      await this.getCards()
      this.storeCities(cities)
    }
  }

  // Save cities in the localStorage
  storeCities(cities) {
    const jsonCities = JSON.stringify(cities)
    window.localStorage.setItem('cities', jsonCities)
  }

  // Restore cities from localStorage
  restoreCities() {
    const rawCities = window.localStorage.getItem('cities')
    this.cities = rawCities ? JSON.parse(rawCities) : []
  }

  // It uses restore because is only run only in the web browser even with SSR
  async mounted() {
    this.restoreCities()
    await this.getCards()
  }
}
</script>
