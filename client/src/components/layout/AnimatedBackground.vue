<template>
  <div class="bg-blobs">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
    <div class="blob blob-4"></div>
  </div>
</template>

<style scoped>
.bg-blobs {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.3;
  animation: blobFloat 20s ease-in-out infinite alternate;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: #818cf8;
  top: -10%;
  left: -5%;
  animation-delay: 0s;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: #c084fc;
  top: 30%;
  right: -5%;
  animation-delay: -5s;
  animation-duration: 25s;
}

.blob-3 {
  width: 350px;
  height: 350px;
  background: #f472b6;
  bottom: -5%;
  left: 30%;
  animation-delay: -10s;
  animation-duration: 22s;
}

.blob-4 {
  width: 300px;
  height: 300px;
  background: #67e8f9;
  top: 60%;
  left: 10%;
  animation-delay: -15s;
  animation-duration: 28s;
}

@keyframes blobFloat {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  25% {
    transform: translate(40px, -30px) scale(1.1) rotate(10deg);
  }
  50% {
    transform: translate(-20px, 40px) scale(0.95) rotate(-5deg);
  }
  75% {
    transform: translate(30px, 20px) scale(1.05) rotate(5deg);
  }
  100% {
    transform: translate(-40px, -20px) scale(1) rotate(-10deg);
  }
}
</style>
