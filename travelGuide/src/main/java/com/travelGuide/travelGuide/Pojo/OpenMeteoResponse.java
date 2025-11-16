package com.travelGuide.travelGuide.Pojo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenMeteoResponse {

    private CurrentWeather current_weather;

    public CurrentWeather getCurrent_weather() {
        return current_weather;
    }
    public void setCurrent_weather(CurrentWeather current_weather) {
        this.current_weather = current_weather;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CurrentWeather {
        private double temperature;
        private double windspeed;
        private int weathercode;
        private String time;
        private String description;
        
        
        public String getDescription() {
			return description;
		}
		public void setDescription(String description) {
			this.description = description;
		}
		public double getTemperature() {
            return temperature;
        }
        public void setTemperature(double temperature) {
            this.temperature = temperature;
        }
        public double getWindspeed() {
            return windspeed;
        }
        public void setWindspeed(double windspeed) {
            this.windspeed = windspeed;
        }
        public int getWeathercode() {
            return weathercode;
        }
        public void setWeathercode(int weathercode) {
            this.weathercode = weathercode;
        }
        public String getTime() {
            return time;
        }
        public void setTime(String time) {
            this.time = time;
        }
    }
}
