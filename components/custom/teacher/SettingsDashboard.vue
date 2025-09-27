<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, EyeOff } from 'lucide-vue-next';

// Define the type for the user profile data
interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  expertise: string;
  profilePicture: string;
  aboutInfo: string;
  personalWebsite: string;
  facebook: string;
  instagram: string;
  x: string;
}

// Dummy user data
const profile = ref<Profile>({
  firstName: 'James',
  lastName: 'Board',
  email: 'aganaploch@yourdomain.com',
  phone: '+123 4567 890',
  username: 'UIUXDesigner.online',
  expertise: 'Creative coder & designer',
  profilePicture: 'https://placehold.co/100x100',
  aboutInfo:
    "Hello, I'm Aga! I'm a coding designer based in Warsaw, Poland. I love sharing my knowledge and experience. This is why I'm working on The Awwwesomes - an initiative that encourages people to start learning coding and designing awesome websites!",
  personalWebsite: 'http://themadbrains.com/',
  facebook: 'https://facebook.com/yourprofile',
  instagram: 'https://instagram.com/yourprofile',
  x: 'https://x.com/yourprofile',
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
</script>

<template>
  <div class="p-6 md:p-10 bg-gray-900 min-h-screen text-gray-200">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card class="col-span-1 md:col-span-2 bg-gray-800 border-gray-700">
        <CardHeader class="border-b border-gray-700 pb-4">
          <CardTitle class="text-xl font-semibold">General Information</CardTitle>
          <CardDescription class="text-gray-400">Manage your basic account details.</CardDescription>
        </CardHeader>
        <CardContent class="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="space-y-2">
            <Label for="firstName">First name</Label>
            <Input id="firstName" v-model="profile.firstName" class="bg-gray-700 border-gray-600 text-gray-200" />
          </div>
          <div class="space-y-2">
            <Label for="lastName">Last name</Label>
            <Input id="lastName" v-model="profile.lastName" class="bg-gray-700 border-gray-600 text-gray-200" />
          </div>
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="profile.email" type="email" class="bg-gray-700 border-gray-600 text-gray-200" />
          </div>
          <div class="space-y-2">
            <Label for="phone">Phone no.</Label>
            <Input id="phone" v-model="profile.phone" class="bg-gray-700 border-gray-600 text-gray-200" />
          </div>
          <div class="space-y-2">
            <Label for="expertise">Expertise</Label>
            <Input id="expertise" v-model="profile.expertise" class="bg-gray-700 border-gray-600 text-gray-200" />
          </div>
          <div class="space-y-2">
            <Label for="username">User name</Label>
            <Input id="username" v-model="profile.username" class="bg-gray-700 border-gray-600 text-gray-200" />
          </div>
        </CardContent>
        <CardContent class="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <div class="relative">
              <Input id="password" :type="showPassword ? 'text' : 'password'" value="**********" class="bg-gray-700 border-gray-600 text-gray-200 pr-10" />
              <Button @click="showPassword = !showPassword" variant="ghost" size="sm" class="absolute right-0 top-0 h-full p-2 text-gray-400 hover:bg-transparent">
                <component :is="showPassword ? EyeOff : Eye" class="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div class="space-y-2">
            <Label for="confirm-password">Confirm Password</Label>
            <div class="relative">
              <Input id="confirm-password" :type="showConfirmPassword ? 'text' : 'password'" value="**********" class="bg-gray-700 border-gray-600 text-gray-200 pr-10" />
              <Button @click="showConfirmPassword = !showConfirmPassword" variant="ghost" size="sm" class="absolute right-0 top-0 h-full p-2 text-gray-400 hover:bg-transparent">
                <component :is="showConfirmPassword ? EyeOff : Eye" class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="bg-gray-800 border-gray-700 h-fit">
        <CardHeader class="border-b border-gray-700 pb-4">
          <CardTitle class="text-xl font-semibold">Profile Update</CardTitle>
        </CardHeader>
        <CardContent class="pt-6 flex flex-col items-center">
          <Avatar class="h-24 w-24 mb-4">
            <AvatarImage :src="profile.profilePicture" alt="Profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Button variant="outline" class="w-full mb-2 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"> Change Image </Button>
          <Button variant="outline" class="w-full bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"> Remove Image </Button>
        </CardContent>
      </Card>
    </div>

    <Card class="mt-6 bg-gray-800 border-gray-700">
      <CardHeader class="border-b border-gray-700 pb-4">
        <CardTitle class="text-xl font-semibold">About Info</CardTitle>
      </CardHeader>
      <CardContent class="pt-6 space-y-4">
        <div class="space-y-2">
          <Label for="about-info">Tell us about yourself</Label>
          <textarea
            id="about-info"
            v-model="profile.aboutInfo"
            class="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            rows="4"
          ></textarea>
        </div>
      </CardContent>
    </Card>

    <Card class="mt-6 bg-gray-800 border-gray-700">
      <CardHeader class="border-b border-gray-700 pb-4">
        <CardTitle class="text-xl font-semibold">Online Presence</CardTitle>
        <CardDescription class="text-gray-400">Add links to your social media and personal website.</CardDescription>
      </CardHeader>
      <CardContent class="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="space-y-2">
          <Label for="personal-website">Personal Website</Label>
          <Input id="personal-website" v-model="profile.personalWebsite" class="bg-gray-700 border-gray-600 text-gray-200" />
        </div>
        <div class="space-y-2">
          <Label for="facebook">Facebook</Label>
          <Input id="facebook" v-model="profile.facebook" class="bg-gray-700 border-gray-600 text-gray-200" />
        </div>
        <div class="space-y-2">
          <Label for="instagram">Instagram</Label>
          <Input id="instagram" v-model="profile.instagram" class="bg-gray-700 border-gray-600 text-gray-200" />
        </div>
        <div class="space-y-2">
          <Label for="x">X (Twitter)</Label>
          <Input id="x" v-model="profile.x" class="bg-gray-700 border-gray-600 text-gray-200" />
        </div>
      </CardContent>
    </Card>

    <div class="mt-6 flex justify-end">
      <Button class="bg-indigo-600 text-white hover:bg-indigo-500"> Save Changes </Button>
    </div>
  </div>
</template>
