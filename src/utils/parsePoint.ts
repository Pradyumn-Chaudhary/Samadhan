export const parsePoint = (pointString: string) => {
    // Example: "POINT(77.4977 27.2153)"
    const match = pointString.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
    if (!match) return null;
    return {
      longitude: parseFloat(match[1]),
      latitude: parseFloat(match[2]),
    };
  };