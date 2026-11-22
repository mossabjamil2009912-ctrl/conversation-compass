import { useEffect, useState } from "react";

// Old PWABuilder APK opens the legacy host, which forwards here with ?moved=1 and shows a browser bar.
// Such devices are locked on this screen until they install the new APK (same signing key = in-place update).
const FLAG = "actes_old_apk";
const arrivedMoved = typeof window !== "undefined" && new URL(window.location.href).searchParams.get("moved") === "1";

export function ApkUpdateGate() {
  const [block, setBlock] = useState(false);
  useEffect(() => {
    const android = /Android/i.test(navigator.userAgent);
    const standalone = matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: fullscreen)").matches
      || document.referrer.startsWith("android-app://");
    if (standalone || !android) { localStorage.removeItem(FLAG); return; }
    if (arrivedMoved) localStorage.setItem(FLAG, "1");
    setBlock(localStorage.getItem(FLAG) === "1");
  }, []);
  if (!block) return null;
  return (
    <div dir="rtl" className="fixed inset-0 z-[110] flex flex-col items-center justify-center gap-5 bg-background p-6 text-center text-foreground">
      <h2 className="text-2xl font-bold">يوجد تحديث جديد للتطبيق</h2>
      <p className="text-muted-foreground">يجب تحديث التطبيق للمتابعة. محادثاتك وبياناتك تبقى كما هي.</p>
      <a href="/downloads/actes-crm.apk" download="actes-crm.apk"
        className="rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground">تحديث الآن</a>
      <p className="text-sm text-muted-foreground">بعد التنزيل افتح الملف واضغط «تحديث»، ثم افتح التطبيق من جديد.</p>
    </div>
  );
}
