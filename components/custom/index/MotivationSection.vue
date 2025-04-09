<template>
  <CustomContainer>
    <section class="py-16 bg-white">
        <div class="flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
          <!-- Image Placeholder -->
          <div class="w-full lg:w-1/2">
            <img
              src="/assets/images/motivation.png"
              alt="Learning Illustration"
              class="w-full max-w-[600px] mx-auto"
            />
          </div>
  
          <!-- Text Content -->
          <div class="w-full lg:w-1/2 text-right max-lg:text-center">
            <h2 class="text-2xl md:text-3xl font-semibold mb-4 leading-relaxed">
              انضمّ إلى مجتمع المتعلّمين، وابدأ رحلتك نحو التميز، مع برامج مصمّمة لتنمية مهاراتك واكتشاف إمكانياتك الحقيقية.
            </h2>
            <ul class="mb-6 space-y-2 text-gray-700 font-medium">
              <li class="flex items-center gap-2 max-lg:justify-center justify-end">
                <span>✔</span>
                <span>تعلم في أي وقت</span>
              </li>
              <li class="flex items-center max-lg:justify-center gap-2 justify-end">
                <span>✔</span>
                <span>محتوى احترافي</span>
              </li>
              <li class="flex items-center max-lg:justify-center gap-2 justify-end">
                <span>✔</span>
                <span>تقييمات مستمرة</span>
              </li>
            </ul>
            <Button class="bg-[#f0f0f0]  text-black px-6 py-2 cursor-pointer rounded-2xl hover:bg-[#FF782D] hover:text-white transition">
              استكشاف الدورة
            </Button>
          </div>
        </div>
      </section>
    </CustomContainer>
  </template>
  