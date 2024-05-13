import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

import { FontAwesome } from '@expo/vector-icons';

export default class Video2 extends Component {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        this.state = {
            isPlaying: false,
        };
    }

    handlePlayPause = async () => {
        if (this.videoRef.current) {
            if (this.state.isPlaying) {
                await this.videoRef.current.pauseAsync();
            } else {
                await this.videoRef.current.playAsync();
            }
            this.setState({ isPlaying: !this.state.isPlaying });
        }
    };

    render() {
        const { isPlaying } = this.state;

        return (
            <View style={styles.container}>
                <Video
                    ref={this.videoRef}
                    source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    isLooping
                    style={styles.video}
                />

                <TouchableOpacity onPress={this.handlePlayPause} style={styles.playPauseButton}>
                    {isPlaying ? (
                        <FontAwesome name="pause" size={30} color="white" style={styles.iconShadow} />
                    ) : (
                        <FontAwesome name="play" size={30} color="white" style={styles.iconShadow} />
                    )}              
                    </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:60,
    },
    video: {
        width: '96%',
        aspectRatio: 16 / 9, 
        backgroundColor: 'black', 
    },
    playPauseButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -12 }, { translateY: -12 }], 
    },
    iconShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
    },
});
