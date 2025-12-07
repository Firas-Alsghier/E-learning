<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';
const auth = useAuthStore();
const { t } = useI18n();
defineProps<{
  title?: string;
  likes?: number;
}>();

const studentPropData = [
  {
    studentName: 'سارة عبد الله',
    StudentQuote:
      'المنصة فعلاً غيرت تجربتي التعليمية! طريقة الشرح واضحة والمحتوى منسق بطريقة تخليك تستمتع بالتعلم 👩‍💻. الأساتذة محترفين جدًا، والدروس سهلة التطبيق حتى للمبتدئين. أنصح أي شخص يجربها بدون تردد.',
    Studentcountry: 'ليبيا',
  },
  {
    studentName: 'أحمد يوسف',
    StudentQuote: 'من أفضل المنصات اللي جربتها 👏. التسجيل سهل، والدروس غنية بالمحتوى. تعلمت مهارات جديدة حسّنت مستواي في العمل. أشكر الفريق على المتابعة والدعم المستمر، أنصح الجميع بها!',
    Studentcountry: 'مصر',
  },
  {
    studentName: 'ليلى حسن',
    StudentQuote: 'أحب واجهة الموقع وطريقة العرض الجميلة 😍. كل شيء منظم وسهل، والدروس ممتعة ومليئة بالمعلومات الجديدة. شعرت أني أتعلم بشغف، خصوصًا مع التفاعل الرائع من المدرسين والطلاب.',
    Studentcountry: 'اليمن',
  },
  {
    studentName: 'مروان خالد',
    StudentQuote: 'بصراحة، ما توقعت أستفيد بهذا الشكل. الكورسات عملية ومليانة أمثلة حقيقية 💪. حسّنت مهاراتي في وقت قصير جدًا، والدعم الفني دائمًا متعاون. تجربة احترافية فعلاً وتستحق كل التقدير.',
    Studentcountry: 'لبنان',
  },
];
</script>
<template>
  <CustomContainer>
    <section class="py-16 px-4">
      <div class="text-center mb-12">
        <h2 class="text-xl sm:text-2xl font-semibold text-primary-custom">{{ t('say-about-us') }}</h2>
        <p class="mt-2 text-secondary-custom text-sm sm:text-base">{{ t('explore-student-rate') }}</p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        <CustomIndexTestimonialCard :-student-name="t('review-name-one')" :-student-quote="t('review-one')" :-studentcountry="t('review-country-one')" />
        <CustomIndexTestimonialCard :-student-name="t('review-name-two')" :-student-quote="t('review-two')" :-studentcountry="t('review-country-two')" />
        <CustomIndexTestimonialCard :-student-name="t('review-name-three')" :-student-quote="t('review-three')" :-studentcountry="t('review-country-three')" />
        <CustomIndexTestimonialCard :-student-name="t('review-name-four')" :-student-quote="t('review-four')" :-studentcountry="t('review-country-four')" />
      </div>
    </section>
  </CustomContainer>
</template>
