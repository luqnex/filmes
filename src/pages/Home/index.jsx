import React, { useState, useEffect } from "react";
import { ScrollView, ActivityIndicator } from 'react-native'

import { Container, 
    SerchContainer, 
    Input, 
    SearchButton, 
    Title, 
    BannerButton,
    Banner,
    SliderMovie 
} from './styles'

import { Feather } from "@expo/vector-icons";
import Header from '../../components/Header'
import SliderItem from '../../components/SliderItem'

import api, { key } from '../../services/api'
import { getListMovies, randomBanner } from '../../utils/movie'

import { useNavigation } from '@react-navigation/native'

function Home() {

    const [nowMovies, setNowMovies] = useState([])
    const [popularMovies, setPopularMovies] = useState([])
    const [topMovies, setTopMovies] = useState([])
    const [bannerMovie, setBannerMovie] = useState({})

    const [loading, setLoading] = useState(true)

    const navigation = useNavigation()
    
    // Acessa a URL de filmes e renderiza quando incia o app.
    useEffect(() => {
        let isActive = true;

        // ac desmonsta o componente quando mudar de pagina
        const ac = new AbortController()

        async function getMovies() {
            const [nowData, popularData, topData] = await Promise.all([
                // Requisição para em cartaz
                api.get('/movie/now_playing', {
                    params: {
                        api_key: key,
                        language: 'pt-BR',
                        page: 1,
                    }
                }),
                // Requisição para populares
                api.get('/movie/popular', {
                    params: {
                        api_key: key,
                        language: 'pt-BR',
                        page: 1,
                    }
                }),
                // Requisição para mais avaliados
                api.get('/movie/top_rated', {
                    params: {
                        api_key: key,
                        language: 'pt-BR',
                        page: 1,
                    }
                }),
            ])

            

            if(isActive) {
                const nowList = getListMovies(10, nowData.data.results)
                const popularList = getListMovies(5, popularData.data.results)
                const topList = getListMovies(5, topData.data.results)

                setBannerMovie(nowData.data.results[randomBanner(nowData.data.results)])

                console.log(bannerMovie)
                
                setNowMovies(nowList)
                setPopularMovies(popularList)
                setTopMovies(topList)
                // Faz com que apareça o loading enquanto o valor for true, quando for falso ele some.
                setLoading(false)
            }
        }

        getMovies()

        return () => {
            isActive = false
            ac.abort()
        }

    }, [])

    // Navega para a pagina de Detalhes 
    function navigateDetailsPage(item) {
        navigation.navigate('Detail', { id: item.id })
    }

    if(loading) {
        return (
            <Container>
                <ActivityIndicator 
                    size="large" 
                    color="#FFF"    
                />
            </Container>
        )
    }

    return (
        <Container>
            <Header title="React Prime" />

            <SerchContainer>
                <Input 
                    placeholder="Ex Vingadores"
                    placeholderTextColor="#ddd"
                />
                <SearchButton>
                    <Feather name="search" size={30} color="#FFF" />
                </SearchButton>
            </SerchContainer>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Title>Em cartaz</Title>

                <BannerButton 
                    activeOpacity={1}
                    onPress={ () => navigateDetailsPage(bannerMovie)} >
                    <Banner 
                        resizeMethod="resize"
                        source={{ uri: `https://image.tmdb.org/t/p/original/${bannerMovie.poster_path}` }}
                    />
                </BannerButton>

                <SliderMovie 
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={nowMovies}
                    renderItem={ ({ item }) => <SliderItem data={item} navigatePage={ () => navigateDetailsPage(item) } /> }
                    keyExtractor={ (item) => String(item.id )}
                />

                <Title>Populares</Title>

                <SliderMovie 
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={popularMovies}
                    renderItem={ ({ item }) => <SliderItem data={item} navigatePage={ () => navigateDetailsPage(item) } /> }
                    keyExtractor={ (item) => String(item.id )}
                />

                <Title>Mais votados</Title>

                <SliderMovie 
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={topMovies}
                    renderItem={ ({ item }) => <SliderItem data={item} navigatePage={ () => navigateDetailsPage(item) } /> }
                    keyExtractor={ (item) => String(item.id )}
                />
            </ScrollView>
        </Container>
    )
}

export default Home;