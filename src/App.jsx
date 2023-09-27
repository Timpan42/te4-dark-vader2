import { useEffect, useState } from 'react'
import './App.css'
import Spinner from './componets/Spinner'

function App() {
  //  Get location from browser X
  //  Save data to localstorage X

  // 1. Check if location is the same as last time X
  // 2. If location is the same as last time, use data from localstorage X
  // 3. If location is not the same as last time, fetch new data  X
  // 4. IF data is older than 10 minutes, fetch new data X

  const [lat, setLat] = useState([])
  const [long, setLong] = useState([])
  const [weatherData, setWeatherData] = useState([])
  const [localWeatherData, setLocalWeatherData] = useState(() => {
    return JSON.parse(localStorage.getItem('localWeatherData')) || []
  })

  // Gets location of the user lat, long. Then checks the weather of the users location   
  useEffect(() => {
    async function fetchWeather() {

      localStorage.setItem('localWeatherData', JSON.stringify(localWeatherData))

      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
      })

      if (lat.length === 0 || long.length === 0) {
        return
      }

      const now = new Date().getTime();
      const tenMinutes = 1000 * 60 * 1

      if (localWeatherData.lat == lat && localWeatherData.long == long) {
        console.log("location is the same as last time: get data from localStorage")
        if (now - localWeatherData.time < tenMinutes) {
          console.log("timer")
          setWeatherData(localWeatherData.weatherData)
          return
        }
      }

      console.log("Get nu data")
      const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
      await fetch(`${baseUrl}lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          setWeatherData(result)
          setLocalWeatherData({ lat: lat, long: long, weatherData: result, time: now })
        }).catch(err => {
          console.log(err)
        })
    }

    fetchWeather()

  }, [lat, long])

  return (
    <>
      <h1>Dark Väder</h1>

      {weatherData.main ? (
        <>
          <h2>City: {weatherData.name}</h2>
          <h2>Temp: {(weatherData.main.temp - 273.15).toFixed(1)} </h2>
        </>
      ) : (
        <Spinner />
      )
      }

    </>
  )
}

export default App