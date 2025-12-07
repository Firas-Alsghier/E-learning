<script setup lang="ts">
const { isLoggedIn } = useUser();
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';
const auth = useAuthStore();
const { t } = useI18n();
</script>

<template>
  <main class="h-[90vh] max-sm:h-[70vh] relative overflow-hidden bg-gradient-to-r from-[#394451] to-[#303a45]">
    <CustomContainer>
      <div class="absolute -right-16 -top-16 max-lg:hidden max-xl:w-[35%] max-sm:hidden">
        <img src="/assets/images/Vector.png" width="450" alt="" />
      </div>
      <div class="absolute -right-28 bottom-0 max-sm:hidden">
        <img src="/assets/images/pencils.png" alt="" />
      </div>
      <div class="absolute right-[350px] top-2 max-xl:right-0 max-sm:hidden max-lg:hidden max-xl:w-[35%]">
        <img src="/assets/images/spits.png" alt="" />
      </div>
      <div class="absolute left-14 top-20 max-md:left-28 max-md:w-[65%] max-2xl:top-32 max-2xl:w-[45%] max-xl:top-36 max-xl:w-[50%] max-sm:hidden">
        <img src="/assets/images/school.png" alt="" />
      </div>
      <div class="flex max-sm:flex-col max-md:flex-col -400 max-sm:h-full items-center max-sm:w-full justify-between max-sm:px-20">
        <div class="girl-image w-2/4 max-md:w-[55%] z-10 max-sm:hidden">
          <img src="/assets/images/girl.png" alt="" />
        </div>
        <div
          class="max-sm:w-full z-50 max-md:mt-4 max-md:w-full max-md:text-center max-md:order-1 max-sm:h-full text-right w-2/4 max-sm:text-center max-sm:flex max-sm:flex-col max-sm:justify-center max-sm:items-center max-sm:pt-5"
        >
          <h1 class="text-primary-custom max-xl:text-[40px] text-[48px] font-semibold max-md:text-4xl max-sm:text-4xl" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('invest') }}</h1>
          <p class="text-[16px] max-sm:text-lg font-normal text-secondary-custom my-3" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('develop') }}</p>
          <div :class="auth.isEnglish ? 'text-left' : 'text-right'">
            <NuxtLink to="signup">
              <ClientOnly>
                <Button v-if="!isLoggedIn" class="btn-custom text-primary-custom border-custom text-base rounded-2xl cursor-pointer">{{ t('sign-up') }}</Button>
              </ClientOnly>
            </NuxtLink>
          </div>
        </div>
      </div>
    </CustomContainer>
  </main>
</template>

<style scoped>
* {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
</style>
