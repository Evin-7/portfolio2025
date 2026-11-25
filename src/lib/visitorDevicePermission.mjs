async function hasGrantedLocationPermission(browser) {
  try {
    return (await browser.permissions?.query({ name: "geolocation" }))?.state === "granted";
  } catch {
    return false;
  }
}

export async function requestGrantedDeviceCoordinates(browser) {
  if (!browser.geolocation || browser.webdriver === true) return null;

  for (const enableHighAccuracy of [true, false]) {
    if (!(await hasGrantedLocationPermission(browser))) return null;
    const result = await new Promise((resolve) => {
      browser.geolocation.getCurrentPosition(
        ({ coords }) => resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracyMeters: coords.accuracy,
        }),
        (error) => resolve({ errorCode: error.code }),
        { enableHighAccuracy, maximumAge: 30_000, timeout: 10_000 },
      );
    });
    if (!result.errorCode) return result;
    if (result.errorCode === 1) return null;
  }
  return null;
}
