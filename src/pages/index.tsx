import React, { useEffect, useState, useRef, useCallback } from 'react';
import { HeadFC, PageProps } from 'gatsby';
import '../styles/global.css';

// 引入圖片
import TelegramIcon from '../images/telegram.svg';
import FacebookIcon from '../images/facebook.svg';
import InstagramIcon from '../images/instagram.svg';
import TwitterIcon from '../images/twitter.svg';
import VimeoIcon from '../images/vimeo.svg';
import VideoBackgroundLow from '../images/icon-low.webm';
import VideoBackgroundHigh from '../images/icon.webm';
import MaskImageLow from '../images/Mask-low.svg';
import MaskImageHigh from '../images/Mask.svg';

type Lang = 'en' | 'zh';

const IndexPage: React.FC<PageProps> = () => {
  const [lang, setLang] = useState<Lang>('en');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [videoSrc, setVideoSrc] = useState(VideoBackgroundLow);
  const [maskSrc, setMaskSrc] = useState(MaskImageLow);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  const loadHighQualityAssets = useCallback(() => {
    const videoHigh = new Image();
    videoHigh.src = VideoBackgroundHigh;
    const maskHigh = new Image();
    maskHigh.src = MaskImageHigh;

    Promise.all([
      new Promise(resolve => { videoHigh.onload = resolve; }),
      new Promise(resolve => { maskHigh.onload = resolve; })
    ]).then(() => {
      setVideoSrc(VideoBackgroundHigh);
      setMaskSrc(MaskImageHigh);
      setIsHighQualityLoaded(true);
    });
  }, []);

  useEffect(() => {
    const userLang = navigator.language;
    setLang(userLang.startsWith('zh') ? 'zh' : 'en');

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = maskSrc;
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const img = new Image();
        img.onload = () => {
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = maskSrc;
      }
    };

    window.addEventListener('resize', handleResize);
    
    loadHighQualityAssets();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [maskSrc, loadHighQualityAssets]);

  const content: Record<Lang, { title: string; description: string }> = {
    en: {
      title: 'Welcome to My Website',
      description: 'This is a sample text over a video background.',
    },
    zh: {
      title: 'Giấc Mơ Hành Trình',
      description: 'Đây là văn bản được phủ lên nền video. Đi trong dòng sông thời gian, mỗi khoảnh khắc là một báu vật, nhìn lại những tiếng cười và nước mắt, đan xen thành bức tranh rực rỡ của cuộc sống.',
    },
  };

  const draw = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx && lastPositionRef.current) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
      ctx.lineTo(x, y);
      ctx.lineWidth = 60;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();

      lastPositionRef.current = { x, y };
    }
  }, []);

  const handleStart = useCallback((x: number, y: number) => {
    setIsDrawing(true);
    lastPositionRef.current = { x, y };
  }, []);

  const handleEnd = useCallback(() => {
    setIsDrawing(false);
    lastPositionRef.current = null;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const handleMove = useCallback((x: number, y: number) => {
    if (!isDrawing) return;
    
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      draw(x, y);
    });
  }, [isDrawing, draw]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    handleStart(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }, [handleStart]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    handleMove(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }, [handleMove]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    handleStart(touch.clientX - rect.left, touch.clientY - rect.top);
  }, [handleStart]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(touch.clientX - rect.left, touch.clientY - rect.top);
  }, [handleMove]);

  return (
    <div className="app">
      <video autoPlay muted loop className="video-background">
        <source src={videoSrc} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <canvas
        ref={canvasRef}
        className="scratch-mask"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      />
      <div className="content">
        <h1>{content[lang].title}</h1>
        <p>{content[lang].description}</p>
      </div>
      <div className="social-links">
        <a href="https://t.me/ac_voo" target="_blank" rel="noopener noreferrer">
          <img src={TelegramIcon} alt="Telegram" />
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <img src={FacebookIcon} alt="Facebook" />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <img src={InstagramIcon} alt="Instagram" />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <img src={TwitterIcon} alt="Twitter" />
        </a>
        <a href="https://www.vimeo.com" target="_blank" rel="noopener noreferrer">
          <img src={VimeoIcon} alt="Vimeo" />
        </a>
      </div>
      {!isHighQualityLoaded && <div className="loading-indicator">Loading high quality content...</div>}
    </div>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <>
    <title>Welcome to My Website</title>
    <meta name="description" content="This is a sample text over a video background." />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://vn.699.ooo" />
    <meta property="og:title" content="Welcome to My Website" />
    <meta property="og:description" content="This is a sample text over a video background." />
    <meta property="og:url" content="https://vn.699.ooo" />
    <meta property="og:image" content="/src/images/icon.png" />
    <meta name="twitter:title" content="Welcome to My Website" />
    <meta name="twitter:description" content="This is a sample text over a video background." />
    <meta name="twitter:image" content="/src/images/icon.png" />
    <meta name="twitter:card" content="summary_large_image" />
  </>
);