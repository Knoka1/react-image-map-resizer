import { useEffect, useRef } from "react";

const useImageMapResize = (mapName: string) => {
  const mapRef = useRef<HTMLMapElement>(null);
  const originalCoordsRef = useRef<string[]>([]);
  const resizeTimeoutRef = useRef<number>(100);

  useEffect(() => {
    const resizeMap = () => {
      if (!mapRef.current) return;

      const map = mapRef.current;
      const areas = map.getElementsByTagName(
        "area"
      ) as HTMLCollectionOf<HTMLAreaElement>;
      const img = document.querySelector(
        `img[usemap="#${mapName}"]`
      ) as HTMLImageElement;

      if (!img || !img.complete) {
        // If image is not loaded yet, wait for it
        img?.addEventListener("load", resizeMap, { once: true });
        return;
      }

      // Store original coordinates on first run
      if (originalCoordsRef.current.length === 0 && areas.length > 0) {
        originalCoordsRef.current = Array.from(areas).map(
          (area: HTMLAreaElement) => area.getAttribute("coords") || ""
        );
      }

      const ratio = {
        width: img.width / img.naturalWidth,
        height: img.height / img.naturalHeight,
      };

      // Get computed styles for padding
      const computedStyle = window.getComputedStyle(img);
      const padding = {
        width:
          parseInt(computedStyle.getPropertyValue("padding-left"), 10) || 0,
        height:
          parseInt(computedStyle.getPropertyValue("padding-top"), 10) || 0,
      };

      // Apply resize to each area using original coordinates
      Array.from(areas).forEach((area: HTMLAreaElement, index) => {
        // Use original coordinates to prevent cumulative errors
        const originalCoords =
          originalCoordsRef.current[index]?.split(",") || [];

        if (originalCoords.length === 0) return;

        const newCoords = originalCoords
          .map((coord, i) => {
            const dimension = i % 2 === 0 ? "width" : "height";
            return (
              padding[dimension] + Math.floor(Number(coord) * ratio[dimension])
            );
          })
          .join(",");

        area.setAttribute("coords", newCoords);
      });
    };

    const debouncedResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = window.setTimeout(resizeMap, 100); // Reduced timeout for more responsive feel
    };

    // Create a ResizeObserver to watch for image size changes
    if (typeof ResizeObserver !== "undefined") {
      const img = document.querySelector(
        `img[usemap="#${mapName}"]`
      ) as HTMLImageElement;

      if (img) {
        const resizeObserver = new ResizeObserver(debouncedResize);
        resizeObserver.observe(img);

        // Cleanup ResizeObserver
        return () => {
          resizeObserver.disconnect();
          window.removeEventListener("resize", debouncedResize);
          window.removeEventListener("focus", resizeMap);
          window.removeEventListener("readystatechange", resizeMap);
          document.removeEventListener("fullscreenchange", resizeMap);
        };
      }
    }

    // Initial resize
    resizeMap();

    // Add event listeners as fallback
    window.addEventListener("resize", debouncedResize);
    window.addEventListener("focus", resizeMap);
    window.addEventListener("readystatechange", resizeMap);
    document.addEventListener("fullscreenchange", resizeMap);

    // Run resize after a short delay to ensure image is loaded
    setTimeout(resizeMap, 100);

    // Cleanup
    return () => {
      clearTimeout(resizeTimeoutRef.current);
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("focus", resizeMap);
      window.removeEventListener("readystatechange", resizeMap);
      document.removeEventListener("fullscreenchange", resizeMap);
    };
  }, [mapName]);

  return mapRef;
};

export default useImageMapResize;
