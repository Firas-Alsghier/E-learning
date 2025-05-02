<script setup lang="ts">
import { Facebook, Twitter, Instagram } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

// Safer: make slug computed
const slug = computed(() => route.params.slug as string);
</script>
<template>
  <div class="w-full bg-white">
    <CustomBreadCrumb :items="[{ label: 'Home', href: '/' }, { label: 'Articles', href: '/articles' }, { label: slug }]" />
    <CustomContainer>
      <div class="flex flex-col lg:flex-row-reverse gap-4 my-14">
        <!-- Filters (Left) -->
        <div class="w-full lg:max-w-[280px]">
          <CustomArticlesBlogSidebar />
        </div>

        <!-- Course List + Search (Right) -->
        <div class="max-w-4xl mx-auto space-y-6">
          <h1 class="text-3xl font-bold text-right">كيف تستمتع بقراءة الكتب حتى لو ما كنت تحب القراءة؟</h1>
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span>🧑‍💼 Determined-poitras</span>
            <span>📅 Jan 24, 2023</span>
            <span>💬 20 Comments</span>
          </div>

          <img src="https://content.artofmanliness.com/uploads/2018/02/Read-Books-Header.jpg" alt="Article image" class="w-full rounded-lg" />

          <p class="text-gray-700 leading-loose text-right line-">
            قراءة الكتب لا يجب أن تكون صعبة أو مملة. ليس عليك أن تكون سريعًا أو أن تفهم كل كلمة. الأهم هو الاستمتاع بالرحلة. أولًا، اختر كتابًا يثير اهتمامك. قد يكون قصة، أو موضوعًا تحبه، أو حتى شيئًا
            طريفًا. عندما تقرأ شيئًا تستمتع به، يسهل عليك التركيز. ابحث عن مكان هادئ ومريح. كرسي مريح، أو سريرك، أو زاوية ذات إضاءة جيدة، يمكن أن تُحدث فرقًا كبيرًا. هذا يُساعد عقلك على الاسترخاء
            والتركيز على الكلمات. ليس عليك قراءة الكتاب كاملًا في يوم واحد. ابدأ ببضع صفحات فقط أو اقرأ لمدة عشر دقائق. لا بأس بالقراءة ببطء. خطوة بخطوة، صفحة تلو الأخرى، ستتحسن قراءتك. أحيانًا، ستجد
            كلمات لا تفهمها. هذا طبيعي. لا تتوقف عن القراءة. يمكنك تخمين المعنى أو التحقق منه لاحقًا. المهم هو الاستمرار والاستمتاع بالقصة أو المعلومات. أثناء القراءة، حاول أن تفكر فيما يحدث. من هم
            الشخصيات؟ ما الفكرة الرئيسية؟ ما الذي تشعر به أثناء القراءة؟ هذه الأسئلة تساعدك على التذكر والاستمتاع بالكتاب أكثر. إذا فقدت التركيز، حاول استخدام إصبعك أو علامة مرجعية لمتابعة السطور. هذا
            يُبقي عينيك على المكان الصحيح. وإذا شعرت بالتعب، خذ استراحة. يجب أن تُشعرك القراءة بالسكينة لا بالتوتر. في النهاية، القراءة أشبه بتكوين صداقة مع كتاب. تحلَّ بالصبر، وكن فضوليًا، واستمتع.
            هذه هي أفضل طريقة للقراءة.
          </p>
          <!-- <p class="text-gray-700 leading-relaxed">...continues article content</p> -->

          <!-- Share -->
          <div class="flex items-center gap-3">
            <span class="text-gray-500">Share:</span>
            <span><Facebook /></span>
            <span><Twitter /></span>
            <span><Instagram /></span>
          </div>

          <!-- Prev / Next Articles -->
          <div class="flex justify-between gap-8 border-t pt-6 mt-6">
            <div class="border-2 cursor-pointer border-[#EAEAEA] p-8 rounded-[20px]">
              <p class="text-xs text-gray-500">المقالات السابقة</p>
              <p class="font-medium">Best LearnPress WordPress Theme Collection For 2023</p>
            </div>
            <div class="text-right cursor-pointer border-2 border-[#EAEAEA] p-8 rounded-[20px]">
              <p class="text-xs text-gray-500">المقالات التالية</p>
              <p class="font-medium">Best LearnPress WordPress Theme Collection For 2023</p>
            </div>
          </div>

          <!-- Comments -->
          <div>
            <h2 class="text-xl font-bold">Comments</h2>
            <div class="space-y-4 mt-4">
              <div>
                <p class="font-semibold">Laura Hipster</p>
                <p class="text-sm text-gray-600">October 03, 2022</p>
                <p class="text-gray-700 mt-1">Lorem ipsum dolor sit amet...</p>
              </div>
              <!-- more comments -->
            </div>
          </div>

          <!-- Leave a comment -->
          <div class="mt-10">
            <h3 class="font-semibold text-lg mb-2 text-right">اترك تعليق</h3>
            <form class="space-y-4 text-right">
              <textarea placeholder="التعليق" class="border rounded text-right p-2 w-full h-32"></textarea>
              <div class="flex items-center justify-end gap-2 text-sm">
                <input type="checkbox" />
                <label>احفظ اسمي وبريدي الإلكتروني في هذا المتصفح</label>
              </div>
              <button type="submit" class="bg-orange-500 text-white px-4 py-2 rounded">نشر التعليق</button>
            </form>
          </div>
        </div>
        <!-- end -->
      </div>
    </CustomContainer>
  </div>
</template>
