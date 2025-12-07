<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const auth = useAuthStore();
</script>

<template>
  <div class="home-page bg-primary-custom">
    <CustomIndexMain />
    <CustomIndexHighDemandCourses />
    <CustomIndexCourses />
    <CustomIndexStatsOverview />
    <CustomIndexMotivationSection />
    <CustomIndexTestimonial />
    <CustomIndexBanner />
    <CustomIndexLatestArticles />
  </div>
</template>
