import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

export default class Video2 extends Component {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        this.state = {
            isPlaying: true,
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
        return (
            <View style={styles.container}>
                <Video
                    ref={this.videoRef}
                    source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={styles.video}
                />

                <TouchableOpacity onPress={this.handlePlayPause} style={styles.playPauseButton}>
                    <Text>{this.state.isPlaying ? 'Pause' : 'Play'}</Text>
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
        width: '98%',
        aspectRatio: 16 / 9, 
        backgroundColor: 'black', 
    },
    playPauseButton: {
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 5,
    },
});
