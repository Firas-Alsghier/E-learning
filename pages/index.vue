<script setup lang="ts">
import Main from '@/components/custom/index/Main.vue';
import HighDemandCourses from '@/components/custom/index/HighDemandCourses.vue';
import Courses from '@/components/custom/index/Courses.vue';
import StatsOverview from '@/components/custom/index/StatsOverview.vue';
import MotivationSection from '@/components/custom/index/MotivationSection.vue';
import Testimonial from '@/components/custom/index/Testimonial.vue';
import Banner from '@/components/custom/index/Banner.vue';
</script>

<template>
  <div class="home-page bg-primary-custom">
    <Main />
    <HighDemandCourses />
    <Courses />
    <StatsOverview />
    <MotivationSection />
    <Testimonial />
    <Banner />
  </div>
</template>
