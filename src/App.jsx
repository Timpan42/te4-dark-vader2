import { useEffect, useState } from 'react'
import './App.css'
import Spinner from './componets/Spinner'

function App() {
  const [lat, setLat] = useState([])
  const [long, setLong] = useState([])
  const [weatherData, setWeatherData] = useState([])

  useEffect(() => {
    async function fetchWeather() {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
      })
      console.log('before fetch ' + lat, long)
      if (lat.length === 0 || long.length === 0) {
        return
      }
      const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
      await fetch(`${baseUrl}lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          console.log(result)
          setWeatherData(result)
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
          <h2>Temp: {(weatherData.main.temp - 273.15).toFixed(1)} C</h2>
        </>
      ) : (
        <Spinner />
      )
      }
    </>
  )
}

export default App