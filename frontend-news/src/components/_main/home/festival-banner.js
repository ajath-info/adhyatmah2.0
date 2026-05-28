export default function FestivalBanner({ image, title, subtitle, buttonText, buttonLink }) {
    return (
        <div
            style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                width: '100%',
                height: '200px',
                cursor: 'pointer',
            }}
        >
            {image ? (
                <img
                    src={image}
                    alt={title || 'Festival Banner'}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        fontSize: '14px',
                    }}
                >
                    Yahan apni image lagao
                </div>
            )}

            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%)',
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px',
                    textAlign: 'center',
                }}
            >
                {title && (
                    <p style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>
                        {title}
                    </p>
                )}
                {subtitle && (
                    <p style={{ color: '#ffe0a0', fontSize: '14px', margin: 0 }}>
                        {subtitle}
                    </p>
                )}
                {buttonText && buttonLink && (
                    <a
                        href={buttonLink}
                        style={{
                            marginTop: '8px',
                            background: '#fb8b05',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 700,
                            padding: '10px 32px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            display: 'inline-block',
                        }}
                    >
                        {buttonText}
                    </a>
                )}
            </div>
        </div>
    );
}