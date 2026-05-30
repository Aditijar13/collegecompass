"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import styles from "./HeroSection.module.css";

const POPULAR = ["IIT Delhi", "AIIMS", "IIM Ahmedabad", "BITS Pilani", "NIT Trichy", "XLRI"];

export function HeroSection() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{name:string;slug:string;city:string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // WebGL dot-matrix particle field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const vsrc = `
      attribute vec2 aPos;
      uniform vec2 uRes;
      uniform float uTime;
      uniform vec2 uMouse;
      void main() {
        vec2 pos = aPos;
        float dist = length(pos - uMouse);
        float drift = 0.008 * exp(-dist * 3.0);
        pos += normalize(pos - uMouse) * drift;
        float breath = sin(uTime * 0.6 + aPos.x * 8.0 + aPos.y * 8.0) * 0.003;
        pos.y += breath;
        gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
        float fade = 1.0 - smoothstep(0.3, 1.0, dist);
        gl_PointSize = (1.5 + fade * 1.5) * (0.8 + 0.4 * sin(uTime * 0.8 + aPos.x * 20.0));
      }
    `;
    const fsrc = `
      precision mediump float;
      uniform float uTime;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float r = dot(c,c);
        if (r > 0.25) discard;
        float alpha = (0.25 - r) * 4.0 * (0.3 + 0.15 * sin(uTime * 0.5));
        gl_FragColor = vec4(0.98, 0.45, 0.09, alpha * 0.55);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsrc));
    gl.linkProgram(prog); gl.useProgram(prog);

    const cols = 60, rows = 35;
    const pts: number[] = [];
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      pts.push(i / (cols - 1), j / (rows - 1));
    }
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pts), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let raf: number;
    const tick = (t: number) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t / 1000);
      gl.uniform2f(uMouse, mouseRef.current.x, 1 - mouseRef.current.y);
      gl.drawArrays(gl.POINTS, 0, pts.length / 2);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", onMouse);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMouse); };
  }, []);

  // Autocomplete
  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      const r = await fetch(`/api/colleges/search?q=${encodeURIComponent(query)}&limit=6`);
      const d = await r.json();
      setSuggestions(d.results ?? []);
      setShowSuggestions(true);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const go = (q?: string) => {
    const term = q ?? query;
    setShowSuggestions(false);
    router.push(term.trim() ? `/colleges?search=${encodeURIComponent(term.trim())}` : "/colleges");
  };

  return (
    <section className={styles.section}>
      {/* WebGL Canvas */}
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Radial glow */}
      <div className={styles.glow} />

      <div className={styles.content}>
        {/* Eyebrow */}
        <div className={styles.eyebrow}>
          <Sparkles size={14} color="#f97316" />
          <span className={styles.eyebrowText}>India&apos;s #1 College Discovery Platform</span>
        </div>

        {/* Headline */}
        <h1 className={`display-lg ${styles.headline}`}>
          Find Your Perfect
          <span className={styles.headlineAccent}>
            College in India
          </span>
        </h1>

        <p className={styles.subtext}>
          Explore 500+ colleges. Compare fees, placements and rankings to make the decision that shapes your future.
        </p>

        {/* Search */}
        <div className={styles.searchWrap}>
          <div className={styles.searchBox}>
            <div className={styles.searchIcon}>
              <Search size={18} color="#6b7280" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
              onFocus={() => query && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search by college, city or stream..."
              className={styles.searchInput}
            />
            <button onClick={() => go()} className={`btn-primary ${styles.searchBtn}`}>
              Search <ArrowRight size={15} />
            </button>
          </div>

          {/* Autocomplete dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.autocomplete}>
              {suggestions.map((s) => (
                <button
                  key={s.slug}
                  onMouseDown={() => go(s.name)}
                  className={styles.suggestionItem}
                >
                  <Search size={13} color="#6b7280" />
                  <span className={styles.suggestionName}>{s.name}</span>
                  <span className={styles.suggestionCity}>{s.city}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular searches */}
        <div className={styles.popularRow}>
          <span className={styles.popularLabel}>Popular:</span>
          {POPULAR.map((q) => (
            <button
              key={q}
              onClick={() => go(q)}
              className={styles.popularChip}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
