<script setup lang="ts">
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
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-800">ماذا يقول الطلاب عن منصة راوية</h2>
        <p class="mt-2 text-gray-500 text-sm sm:text-base">استكشف آراء طلابنا وانطباعاتهم بعد تجربة التعلم معنا.</p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        <CustomIndexTestimonialCard :-student-name="studentPropData[0].studentName" :-student-quote="studentPropData[0].StudentQuote" :-studentcountry="studentPropData[0].Studentcountry" />
        <CustomIndexTestimonialCard :-student-name="studentPropData[1].studentName" :-student-quote="studentPropData[1].StudentQuote" :-studentcountry="studentPropData[1].Studentcountry" />
        <CustomIndexTestimonialCard :-student-name="studentPropData[2].studentName" :-student-quote="studentPropData[2].StudentQuote" :-studentcountry="studentPropData[2].Studentcountry" />
        <CustomIndexTestimonialCard :-student-name="studentPropData[3].studentName" :-student-quote="studentPropData[3].StudentQuote" :-studentcountry="studentPropData[3].Studentcountry" />
      </div>
    </section>
  </CustomContainer>
</template>
