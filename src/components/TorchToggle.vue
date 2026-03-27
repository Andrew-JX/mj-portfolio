<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
const { isDark, toggle } = useTheme()
</script>

<template>
  <div class="torch-float" :title="isDark ? '切换到亮色模式' : '切换到暗色模式'">
    <label class="container">
      <input type="checkbox" :checked="!isDark" @change="toggle" />
      <div class="torch">
        <div class="head">
          <div class="face top">
            <div></div><div></div><div></div><div></div>
          </div>
          <div class="face left">
            <div></div><div></div><div></div><div></div>
          </div>
          <div class="face right">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>
        <div class="stick">
          <div class="side side-left">
            <div v-for="i in 16" :key="i"></div>
          </div>
          <div class="side side-right">
            <div v-for="i in 16" :key="i"></div>
          </div>
        </div>
      </div>
    </label>
  </div>
</template>

<style scoped>
/* Floating container — fixed bottom-right */
.torch-float {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 66px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(14, 165, 233, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
}

.torch-float:hover {
  background: rgba(15, 23, 42, 0.92);
  box-shadow: 0 14px 44px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(14, 165, 233, 0.18), 0 0 24px rgba(14, 165, 233, 0.06);
  transform: translateY(-2px);
}

/* Scale the torch down to fit the button */
.container {
  zoom: 0.31;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
}

.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.torch {
  display: flex;
  justify-content: center;
  height: 150px;
}

.head,
.stick {
  position: absolute;
  width: 30px;
  transform-style: preserve-3d;
  transform: rotateX(-30deg) rotateY(45deg);
}

.stick {
  position: relative;
  height: 120px;
}

.face {
  position: absolute;
  transform-style: preserve-3d;
  width: 30px;
  height: 30px;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  background-color: #000000;
}

.top  { transform: rotateX(90deg)  translateZ(15px); }
.left { transform: rotateY(-90deg) translateZ(15px); }
.right{ transform: rotateY(0deg)   translateZ(15px); }

.top div, .left div, .right div { width: 102%; height: 102%; }

/* Unlit fire colours */
.top  div:nth-child(1), .left  div:nth-child(3), .right div:nth-child(3) { background-color: #ffff9760; }
.top  div:nth-child(2), .left  div:nth-child(1), .right div:nth-child(1) { background-color: #ffd80060; }
.top  div:nth-child(3), .left  div:nth-child(4), .right div:nth-child(4) { background-color: #ffffff60; }
.top  div:nth-child(4), .left  div:nth-child(2), .right div:nth-child(2) { background-color: #ff8f0060; }

.side {
  position: absolute;
  width: 30px;
  height: 120px;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: repeat(8, 12.5%);
  cursor: pointer;
  translate: 0 12px;
}

.side-left  { transform: rotateY(-90deg) translateZ(15px) translateY(8px); }
.side-right { transform: rotateY(0deg)   translateZ(15px) translateY(8px); }

.side-left div, .side-right div { width: 103%; height: 103%; }

.side div:nth-child(1)           { background-color: #443622; }
.side div:nth-child(2)           { background-color: #2e2517; }
.side div:nth-child(3),
.side div:nth-child(5)           { background-color: #4b3b23; }
.side div:nth-child(4),
.side div:nth-child(10)          { background-color: #251e12; }
.side div:nth-child(6)           { background-color: #292115; }
.side div:nth-child(7)           { background-color: #4b3c26; }
.side div:nth-child(8)           { background-color: #292115; }
.side div:nth-child(9)           { background-color: #4b3a21; }
.side div:nth-child(11),
.side div:nth-child(15)          { background-color: #3d311d; }
.side div:nth-child(12)          { background-color: #2c2315; }
.side div:nth-child(13)          { background-color: #493a22; }
.side div:nth-child(14)          { background-color: #2b2114; }
.side div:nth-child(16)          { background-color: #271e10; }

/* === LIT STATE (checked = light mode) === */
.container input:checked ~ .torch .face {
  filter:
    drop-shadow(0px 0px 2px rgb(255, 255, 255))
    drop-shadow(0px 0px 10px rgba(255, 237, 156, 0.7))
    drop-shadow(0px 0px 25px rgba(255, 227, 101, 0.4));
}

.container input:checked ~ .torch .top  div:nth-child(1),
.container input:checked ~ .torch .left  div:nth-child(3),
.container input:checked ~ .torch .right div:nth-child(3) { background-color: #ffff97; }

.container input:checked ~ .torch .top  div:nth-child(2),
.container input:checked ~ .torch .left  div:nth-child(1),
.container input:checked ~ .torch .right div:nth-child(1) { background-color: #ffd800; }

.container input:checked ~ .torch .top  div:nth-child(3),
.container input:checked ~ .torch .left  div:nth-child(4),
.container input:checked ~ .torch .right div:nth-child(4) { background-color: #ffffff; }

.container input:checked ~ .torch .top  div:nth-child(4),
.container input:checked ~ .torch .left  div:nth-child(2),
.container input:checked ~ .torch .right div:nth-child(2) { background-color: #ff8f00; }

.container input:checked ~ .torch .side div:nth-child(1)           { background-color: #7c623e; }
.container input:checked ~ .torch .side div:nth-child(2)           { background-color: #4c3d26; }
.container input:checked ~ .torch .side div:nth-child(3),
.container input:checked ~ .torch .side div:nth-child(5)           { background-color: #937344; }
.container input:checked ~ .torch .side div:nth-child(4),
.container input:checked ~ .torch .side div:nth-child(10)          { background-color: #3c2f1c; }
.container input:checked ~ .torch .side div:nth-child(6)           { background-color: #423522; }
.container input:checked ~ .torch .side div:nth-child(7)           { background-color: #9f7f50; }
.container input:checked ~ .torch .side div:nth-child(8)           { background-color: #403320; }
.container input:checked ~ .torch .side div:nth-child(9)           { background-color: #977748; }
.container input:checked ~ .torch .side div:nth-child(11),
.container input:checked ~ .torch .side div:nth-child(15)          { background-color: #675231; }
.container input:checked ~ .torch .side div:nth-child(12)          { background-color: #3d301d; }
.container input:checked ~ .torch .side div:nth-child(13)          { background-color: #987849; }
.container input:checked ~ .torch .side div:nth-child(14)          { background-color: #3b2e1b; }
.container input:checked ~ .torch .side div:nth-child(16)          { background-color: #372a17; }

/* Light mode — adjust the floating button's shell */
:global([data-theme="light"]) .torch-float {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(148, 163, 184, 0.35);
  box-shadow: 0 8px 32px rgba(148, 163, 184, 0.22), 0 0 0 1px rgba(14, 165, 233, 0.08);
}

:global([data-theme="light"]) .torch-float:hover {
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 14px 44px rgba(148, 163, 184, 0.35), 0 0 0 1px rgba(14, 165, 233, 0.25);
}
</style>
