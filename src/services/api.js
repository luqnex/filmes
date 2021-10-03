import axios from "axios";

// URL filmes em cartaz:
// movie/now_playing?api_key=a97319d6d95f841d8f94385b318b7deb&language=pt-BR&page=1

export const key = 'a97319d6d95f841d8f94385b318b7deb'

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3'
})

export default api