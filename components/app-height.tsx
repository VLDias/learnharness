"use client";

/**
 * Viewport height as a CSS variable (2026-10-30).
 *
 * The Android WebView reports `CSS.supports("height","100dvh") === true` but
 * computes `100dvh` as 0 — the whole app column collapsed (transcript and
 * composer measured zero height, only the fixed dock survived). Rather than
 * trusting the unit, measure the viewport in JS and expose it as `--lh-app-h`;
 * the CSS uses it with `dvh`/`vh` as fallbacks.
 *
 * Resize + visualViewport are both observed so the software keyboard and the
 * URL-bar-less WebView both land on the real height.
 */
import { useEffect } from "react";

export function AppHeight() {
	useEffect(() => {
		const set = () => {
			const height = window.visualViewport?.height ?? window.innerHeight;
			if (height > 0) document.documentElement.style.setProperty("--lh-app-h", `${Math.round(height)}px`);
		};
		set();
		window.addEventListener("resize", set);
		window.addEventListener("orientationchange", set);
		window.visualViewport?.addEventListener("resize", set);
		const raf = requestAnimationFrame(set);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", set);
			window.removeEventListener("orientationchange", set);
			window.visualViewport?.removeEventListener("resize", set);
		};
	}, []);
	return null;
}
