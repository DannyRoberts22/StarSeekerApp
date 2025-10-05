import * as SplashScreen from "expo-splash-screen";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

type Props = {
  onFinish?: () => void;
  autoPlay?: boolean;
  loop?: boolean;
};

SplashScreen.preventAutoHideAsync();

export default function AnimatedSplash({ onFinish, autoPlay = true, loop = false }: Props) {
  const [ready, setReady] = useState(false);
  const [lottieError, setLottieError] = useState(false);
  const lottieRef = useRef<LottieView>(null);

  const _logo = require("../assets/lottie/starseeker_logo.png");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // preloadFonts(), hydrateSession(), etc.
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onLayout = useCallback(async () => {
    if (ready) {
      requestAnimationFrame(async () => {
        await SplashScreen.hideAsync();
        if (!autoPlay) lottieRef.current?.play();
      });
    }
  }, [ready, autoPlay]);

  const handleLottieError = useCallback(() => {
    console.log("Lottie animation failed to load");
    setLottieError(true);
    setTimeout(() => {
      onFinish?.();
    }, 2000);
  }, [onFinish]);

  if (!ready) return null;

  if (lottieError) {
    return (
      <View style={[styles.container, styles.fallback]} onLayout={onLayout}>
        <Text style={styles.fallbackText}>StarSeeker</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      <LottieView
        ref={lottieRef}
        source={require("../assets/lottie/starseeker_splash_lottie.json")}
        autoPlay={autoPlay}
        loop={loop}
        onAnimationFinish={onFinish}
        onAnimationFailure={handleLottieError}
        style={styles.lottie}
        enableMergePathsAndroidForKitKatAndAbove
        cacheComposition
        imageAssetsFolder={Platform.select({ android: "assets/lottie", ios: undefined })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000014" },
  lottie: { width: "100%", height: "100%" },
  fallback: { 
    justifyContent: "center", 
    alignItems: "center" 
  },
  fallbackText: { 
    color: "#ffffff", 
    fontSize: 32, 
    fontWeight: "bold" 
  }
});
