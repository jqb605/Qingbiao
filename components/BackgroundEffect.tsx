
import React, { useEffect, useRef } from 'react';

/**
 * [中文说明] 舞台光效配置
 * 这里的参数控制灯光的颜色、大小、移动惯性和胶片噪点的强度。
 */
const CONFIG = {
  // [可修改] 灯光对鼠标的跟随延迟 (0.01 - 1.0)。数值越小，灯光移动越慢，越有“重型设备”的惯性滞后感。
  // [Modifiable] Easing factor. Lower value = heavier, smoother movement.
  followEase: 0.05,

  // [可修改] 环境光斑的数量 (不包括鼠标主光)
  // [Modifiable] Number of ambient drifting lights.
  ambientLightCount: 4,

  // [可修改] 胶片噪点强度 (0 - 255)。
  // [Modifiable] Intensity of the film grain effect.
  noiseIntensity: 18,

  // [可修改] 灯光颜色配置 (RGB格式)
  // [Modifiable] Cinematic Color Palette
  colors: [
    { r: 217, g: 119, b: 6 },     // Amber (主色调 - 经典舞台暖光)
    { r: 0, g: 120, b: 150 },     // Deep Cyan (冷色对比 - 科技感)
    { r: 180, g: 20, b: 60 },     // Velvet Red (戏剧张力 - 情感)
    { r: 80, g: 50, b: 120 },     // Muted Purple (神秘感)
  ]
};

const BackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 鼠标目标位置
  const targetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // 当前主光位置 (用于计算惯性)
  const currentRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // 定义环境光对象
    // Ambient light class
    class AmbientLight {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: { r: number, g: number, b: number };
      phase: number;
      phaseSpeed: number;

      constructor(width: number, height: number, colorIndex: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // 缓慢的漂移速度
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 400 + 300; // 更大的光斑
        this.color = CONFIG.colors[colorIndex % CONFIG.colors.length];
        this.phase = Math.random() * Math.PI * 2;
        this.phaseSpeed = 0.002 + Math.random() * 0.005;
      }

      update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += this.phaseSpeed;

        // 边界反弹
        if (this.x < -400 || this.x > width + 400) this.vx *= -1;
        if (this.y < -400 || this.y > height + 400) this.vy *= -1;
      }
    }

    let ambientLights: AmbientLight[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // 初始化环境光
      ambientLights = [];
      for (let i = 0; i < CONFIG.ambientLightCount; i++) {
        ambientLights.push(new AmbientLight(canvas.width, canvas.height, i));
      }
    };

    // 辅助函数：绘制柔和的光斑
    const drawLight = (x: number, y: number, radius: number, r: number, g: number, b: number, intensity: number) => {
      // 创建径向渐变 (从中心向外)
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      
      // 核心高光
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${intensity})`);
      // 中间衰减
      gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${intensity * 0.5})`);
      // 宽边缘柔化
      gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${intensity * 0.1})`);
      // 边缘完全透明
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    // 辅助函数：生成动态噪点 (模拟胶片颗粒)
    const drawNoise = (width: number, height: number) => {
        const w = width;
        const h = height;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${CONFIG.noiseIntensity / 255})`;
        // 增加噪点数量以提升质感
        for (let i = 0; i < 200; i++) {
             const x = Math.random() * w;
             const y = Math.random() * h;
             ctx.fillRect(x, y, 1, 1);
        }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // 1. 清空画布 (保持黑色背景)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 2. 设置混合模式为 'screen' (即 Additive Blending / 滤色)
      // 这会让重叠的光线变亮，模拟真实物理光照
      ctx.globalCompositeOperation = 'screen'; 

      // 3. 计算主光位置 (平滑跟随)
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;
      currentRef.current.x += dx * CONFIG.followEase;
      currentRef.current.y += dy * CONFIG.followEase;

      // 4. 绘制环境光 (漂浮的背景光)
      ambientLights.forEach((light, index) => {
        light.update(canvas.width, canvas.height);
        // 让环境光随时间呼吸 - 不同颜色的光呼吸频率不同
        const pulse = 0.8 + Math.sin(light.phase) * 0.2; 
        // 增加环境光的不透明度，让颜色更明显
        drawLight(light.x, light.y, light.radius, light.color.r, light.color.g, light.color.b, 0.25 * pulse);
      });

      // 5. 绘制主光 (鼠标控制的聚光灯 - 暖白/琥珀色)
      // 泛光 (大，柔和)
      drawLight(
          currentRef.current.x, 
          currentRef.current.y, 
          700, 
          255, 220, 180, // Warm White
          0.12
      );
      
      // 核心光 (小，略亮)
      drawLight(
          currentRef.current.x, 
          currentRef.current.y, 
          120, 
          255, 255, 255, // Pure White Core
          0.15
      );

      // 6. 恢复混合模式并绘制噪点
      ctx.globalCompositeOperation = 'source-over';
      drawNoise(canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }} // 让父级容器的黑色透出来
    />
  );
};

export default BackgroundEffect;
