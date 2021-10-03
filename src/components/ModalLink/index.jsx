import React from "react";
import { BackButton, Name } from './styled'
import { Feather } from '@expo/vector-icons'

import { WebView } from 'react-native-webview'

function ModalLink({ link, title, closeModal }) {
    return (
        <React.Fragment>
            <BackButton onPress={closeModal}>
                <Feather 
                    name="x" 
                    size={35}
                    color="#FFF"
                />

                <Name 
                    numberOfLines={1}
                >{title}</Name>
            </BackButton>

            <WebView 
                source={{ uri: link }}
            />
        </React.Fragment>
    )
}

export default ModalLink