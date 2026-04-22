import { toast } from "@/shared/components/ui/toast";

export function notifyGeolocationError(err: GeolocationPositionError | null) {
  if (err && err.code === err.PERMISSION_DENIED) {
    toast.error("현재 위치 권한이 차단되어 있습니다.", {
      description: "브라우저 설정에서 위치 권한을 허용으로 바꿔주세요.",
    });
    return;
  }
  toast.error("현재 위치를 가져올 수 없습니다.", {
    description: "잠시 후 다시 시도해 주세요.",
  });
}

export function requestUserLocation(
  options?: PositionOptions,
): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      options ?? { timeout: 10000, maximumAge: 60000 },
    );
  });
}
