<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Atom,
  Search,
  CircleX,
  X,
} from "@lucide/vue";

import elements from "./code/data";
import algorithm from "./code/algorithm";

const text = ref("Iran");

// ----- selected element for the expandable detail row -----
const selectedAtomicNumber = ref<number | null>(null);

const result = computed(() =>
  algorithm(text.value).map((part) => ({
    ...part,
    element:
      part.atomicNumber == null
        ? null
        : elements.find((e) => e.atomicNumber === part.atomicNumber),
  }))
);

// The element object of the currently selected tile (if any)
const selectedElement = computed(() => {
  if (selectedAtomicNumber.value == null) return null;
  return elements.find((e) => e.atomicNumber === selectedAtomicNumber.value) ?? null;
});
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">

    <!-- Navbar -->
    <header class="border-b border-slate-800">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700">
            <Atom class="h-5 w-5" />
          </div>
          <div>
            <h1 class="font-semibold">Element Speller</h1>
            <p class="text-xs text-slate-500">Spell words using the periodic table</p>
          </div>
        </div>

        <!-- Official GitHub Star button -->
        <div class="flex items-center gap-3">
          <iframe
            :src="`https://ghbtns.com/github-btn.html?user=sudo-arash&repo=element-speller&type=star&count=true`"
            frameborder="0"
            scrolling="0"
            width="110"
            height="20"
            title="Star on GitHub"
            class="rounded"
          ></iframe>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <main class="mx-auto max-w-5xl px-6 py-20">
      <div class="text-center">
        <h2 class="text-5xl font-black tracking-tight">
          Spell with <span class="text-cyan-400">Elements</span>
        </h2>
        <p class="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
          Convert any word into the best possible combination of chemical element symbols using backtracking.
        </p>
      </div>

      <!-- Search -->
      <div class="mx-auto mt-14 max-w-3xl">
        <div class="flex items-center rounded-xl border border-slate-800 bg-slate-900 px-5 py-4">
          <Search class="mr-4 h-5 w-5 text-slate-500" />
          <input
            v-model="text"
            placeholder="Try Iran, Carbon, Bacon..."
            class="w-full bg-transparent text-xl outline-none placeholder:text-slate-600"
          />
        </div>
      </div>

      <!-- Result tiles -->
      <section v-if="text" class="mt-16">
        <div class="mb-6">
          <h3 class="font-semibold">Best Match</h3>
        </div>

        <div class="flex flex-wrap justify-center gap-5">
          <template v-for="part in result" :key="part.symbol + part.atomicNumber">
            <!-- Valid element tile (clickable) -->
            <div
              v-if="part.element"
              class="group h-40 w-28 rounded-xl border border-slate-800 bg-slate-900 p-4 transition cursor-pointer hover:border-cyan-500"
              :class="{
                'border-cyan-400 ring-1 ring-cyan-400/50': selectedAtomicNumber === part.element.atomicNumber,
              }"
              @click="selectedAtomicNumber = selectedAtomicNumber === part.element.atomicNumber ? null : part.element.atomicNumber"
            >
              <div class="flex h-full flex-col">
                <div class="text-sm text-slate-500">
                  {{ part.element.atomicNumber }}
                </div>
                <div class="mt-auto text-center">
                  <div class="text-5xl font-black">
                    {{ part.element.symbol }}
                  </div>
                  <div class="mt-2 truncate text-xs text-slate-500">
                    {{ part.element.name }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Invalid tile -->
            <div
              v-else
              class="flex h-40 w-28 flex-col items-center justify-center rounded-xl border border-red-900 bg-red-950/20"
            >
              <CircleX class="mb-3 h-6 w-6 text-red-500" />
              <div class="text-5xl font-black text-red-400">
                {{ part.symbol }}
              </div>
              <div class="mt-2 text-xs text-red-400">Unknown</div>
            </div>
          </template>
        </div>

        <!-- Expandable detail row (appears below the tiles when a tile is clicked) -->
        <Transition name="detail">
          <div
            v-if="selectedElement"
            class="mt-8 overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-900/80 backdrop-blur"
          >
            <div class="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <h4 class="text-lg font-semibold text-cyan-400">
                {{ selectedElement.symbol }} – {{ selectedElement.name }}
              </h4>
              <button
                @click="selectedAtomicNumber = null"
                class="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                aria-label="Close details"
              >
                <X class="h-5 w-5" />
              </button>
            </div>
            <div class="grid grid-cols-2 gap-4 px-5 py-5 sm:grid-cols-4">
              <div>
                <p class="text-xs text-slate-500">Symbol</p>
                <p class="text-lg font-bold">{{ selectedElement.symbol }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">Name</p>
                <p class="text-lg">{{ selectedElement.name }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">Atomic #</p>
                <p class="text-lg">{{ selectedElement.atomicNumber }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">Mass</p>
                <p class="text-lg">{{ selectedElement.atomicMass }}</p>
              </div>
            </div>
          </div>
        </Transition>
      </section>

      <!-- No more separate Breakdown table -->
    </main>

    <footer class="border-t border-slate-800 py-10 text-center text-sm text-slate-500">
      Built with Vue, TypeScript and Tailwind CSS.
    </footer>
  </div>
</template>

<style scoped>
.detail-enter-active,
.detail-leave-active {
  transition: all 0.3s ease;
}
.detail-enter-from,
.detail-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>