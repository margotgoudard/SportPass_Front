import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';

export default class Video2 extends Component {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        this.state = {
            isPlaying: false,
            showControls: true,
        };
        this.hideControlsTimer = null;
    }

    handlePlayPause = async () => {
        if (this.videoRef.current) {
            if (this.state.isPlaying) {
                await this.videoRef.current.pauseAsync();
            } else {
                await this.videoRef.current.playAsync();
                this.startHideControlsTimer();
            }
        }
    };

    startHideControlsTimer = () => {
        if (this.hideControlsTimer) {
            clearTimeout(this.hideControlsTimer);
        }
        this.hideControlsTimer = setTimeout(() => {
            this.setState({ showControls: false });
        }, 3000); 
    };

    handleVideoTap = () => {
        if (!this.state.showControls) {
            this.setState({ showControls: true });
            this.startHideControlsTimer();
        }
    };

    handlePlaybackStatusUpdate = (playbackStatus) => {
        const { isPlaying } = playbackStatus;
        if (isPlaying !== this.state.isPlaying) {
            this.setState({ isPlaying });
            if (isPlaying) {
                this.setState({ showControls: true });
                this.startHideControlsTimer();
            }
        }
    };

    render() {
        const { showControls } = this.state;

        return (
            <View style={styles.container}>
                <Video
                    ref={this.videoRef}
                    source={require('../../assets/pub.mp4')}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    isLooping
                    style={styles.video}
                    onTouchStart={this.handleVideoTap} 
                    onPlaybackStatusUpdate={this.handlePlaybackStatusUpdate} 
                />

                {showControls && (
                    <TouchableOpacity onPress={this.handlePlayPause} style={styles.playPauseButton}>
                        {this.state.isPlaying ? (
                            <FontAwesome name="pause" size={30} color="white" style={styles.iconShadow} />
                        ) : (
                            <FontAwesome name="play" size={30} color="white" style={styles.iconShadow} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        transform: [{ translateX: -15 }, { translateY: -15 }],
    },
    iconShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
    },
});
