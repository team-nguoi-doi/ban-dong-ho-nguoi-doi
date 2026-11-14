import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import eleganceVideo from '../../../assets/banner/hero-banner-video-5.mp4';

export default function CampaignVideoBanner() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPaused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
            setIsPaused(!isPaused);
        }
    };

    return (
        <section
            style={{
                position: 'relative',
                width: '100%',
                height: '78vh',
                minHeight: '520px',
                overflow: 'hidden',
                marginTop: '4rem',
                backgroundColor: '#111',
            }}
        >
            <video
                ref={videoRef}
                src={eleganceVideo}
                autoPlay
                muted
                loop
                playsInline
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.1) 100%)',
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    bottom: '12%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    color: '#ffffff',
                    zIndex: 2,
                    width: '90%',
                }}
            >
                <h2
                    style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
                        letterSpacing: '0.18em',
                        fontWeight: 500,
                        margin: '0 0 1.8rem',
                        textTransform: 'uppercase',
                    }}
                >
                    HOME OF ELEGANCE
                </h2>
                <div style={{ display: 'flex', gap: '2.8rem', justifyContent: 'center' }}>

                    <Link
                        to="/products"
                        style={{
                            color: '#ffffff',
                            textDecoration: 'none',
                            borderBottom: '1px solid #ffffff',
                            paddingBottom: '4px',
                            letterSpacing: '0.14em',
                            fontSize: '1.2rem',
                        }}
                    >
                        Shop now
                    </Link>
                </div>
            </div>

            <div
                style={{
                    position: 'absolute',
                    bottom: '2.4rem',
                    right: '3rem',
                    display: 'flex',
                    gap: '1.2rem',
                    zIndex: 3,
                }}
            >
                <button
                    type="button"
                    onClick={toggleMute}
                    aria-label="Toggle Sound"
                    style={{
                        background: 'rgba(0,0,0,0.45)',
                        border: 'none',
                        color: '#fff',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '1.3rem',
                    }}
                >
                    {isMuted ? '🔇' : '🔊'}
                </button>
                <button
                    type="button"
                    onClick={togglePlay}
                    aria-label="Toggle Play"
                    style={{
                        background: 'rgba(0,0,0,0.45)',
                        border: 'none',
                        color: '#fff',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                    }}
                >
                    {isPaused ? '▶' : '❚❚'}
                </button>
            </div>
        </section>
    );
}