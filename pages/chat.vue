<template>
    <h4 class="main-title lg mb-5 page-title">
  <div class="container fs17">
    <nuxt-link to="/"><i class="fas fa-home c-main"></i></nuxt-link>
    /
   المحادثة
  </div>
</h4>
  <div class="container">
    
    <div class="main-chat mb-5">

      <div class="border-div w-full lg:w-10/12 mx-auto">
        <div class="top-area bg-white  rounded-3 p-2">
          <div class="flex-sm-gap-chat">
            <img :src="recieverData?.image" alt="img" class="sendresieve-img">
            <div>
              <p>{{ recieverData?.name }}</p>
            </div>
          </div>
        </div>
        <hr />
        <div
          class="bg-white min-vh-height py-4 px-2 messages-area"
          ref="messagesArea"
        >
          <div class="flex mt-2 mb-2 justify-center">
              <i class="fas fa-spinner fa-spin" v-if="pagination.loading"></i>
          </div>
          <div
            class="single-message-loop mb-3"
            v-for="message in messages"
            :key="message"
          >
            <div
              class="flex-sm-gap-chat"
              :class="{ reverse: message.sender_id != user?.id }"
            >
            <img :src="message.avatar" class="sendresieve-img" alt="img">
              <div class="flex gap-3 message-main">
                <div
                  class="senderMessage"
                  :class="{ recieverMessage: message.sender_id != user?.id }"
                >
                  <span v-if="message.type == 'text'">{{ message.body }}</span>
                  <Image
                    v-else-if="message.type == 'image'"
                    :src="message.body"
                    alt="Image"
                    width="250"
                    preview
                  />
                  <a
                    :href="message.body"
                    target="_blank"
                    class="message-file flex flex-col gap-4"
                    v-else-if="message.type == 'file'"
                  >
                    <i class="far fa-file fs18"></i>
                    <span>file</span>
                  </a>
                </div>
                <div class="message-time">
                  {{ message.created_at }} 
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <hr class="mx-5 mb-0 mt-0" /> -->
        <form @submit.prevent="sendMessage" :class="{'d-none' : route.query.type == 'finished'}  " class=" form-cont mt-2 px-0">
          <div class="position-relative flex-1 w-100" >
            <textarea
              v-model="inputVal"
              ref="textref"
              class="w-full  w-100"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.enter.shift.exact.prevent="newline"
              rows="2"
              placeholder="اكتب رسالتك هنا"
            ></textarea>

            <img
              :src="imageSrc"
              @click="removeFile"
              alt="image"
              class="preview-img-main"
              v-if="fileType == 'image' && imageSrc"
            />
            <div
              @click="removeFile"
              v-if="fileType == 'file' && imageSrc"
              class="upload-file-prev flex flex-col gap-3"
            >
              <i class="far fa-file"></i>
              <span class="clamp-1 c-white text-center fs11">{{ imageName }}</span>
            </div>

          </div>

          <div class="flex items-center gap-4">
            <!-- <div class="image-upload">
              <label for="uploader-image" class="mb-0">
                <i class="fas fa-paperclip"></i>
              </label>
              <input
                type="file"
                accept="image/*, application/pdf"
                ref="uploaderMain"
                @change="handleFile($event)"
                hidden
                id="uploader-image"
              />
            </div> -->
            <button
              type="submit"
              class="send-btn"
              :disabled="(!inputVal || inputVal.trim().length === 0 || btnLoad) && !imageName || btnLoad"
            >
              <i class="fas fa-paper-plane" v-if="!btnLoad" style="font-size: 2rem"></i>
              <i class="fas fa-spinner fa-spin" v-else style="font-size: 2rem"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  name: "Home.chat",
  authIsRequired: true,
  middleware: "auth",
});

/******************* Plugins *******************/
// Global Store
import { useGlobalStore } from '@/stores/global';
const globalStore = useGlobalStore();
const { providerName } = storeToRefs(globalStore);

// i18n
import { useI18n } from "vue-i18n";
const { locale, t } = useI18n({ useScope: "global" });

const authStore = useAuthStore();
const { token  , user  } = storeToRefs(authStore);
const { mac_address } = storeToRefs(globalStore);

const config = computed(() => {
    return token.value
        ? {
            headers: { Authorization: `Bearer ${token.value}` },
        }
        : {};
});
// Response
const { response } = responseApi();

// Axios
const axios = useApi();

//toastNotify
const { toastNotify } = toastMsg();

// route
const route = useRoute()
const roomMessagesEndpoint = computed(
  () => `general/get-room-messages/${route.query.id}`,
);

const {
  payload: roomMessagesPayload,
  refresh: refreshRoomMessages,
} = await useApiData(() => roomMessagesEndpoint.value, {
  auth: true,
  query: computed(() => ({ page: 1 })),
  cacheKey: `api:chat-room:${route.query.id}:page-1`,
});


import { io } from 'socket.io-client';
import moment from 'moment';
import "moment/dist/locale/ar";
// moment locale
// moment.locale(locale.value);

const socket = ref(null);
socket.value = io("https://dashboard.offroadsapp.com:4992", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ["websocket"],
  query: {
    userId: user.value?.id,
    userType: 'user',
    name: user.value?.name,
    avatar: user.value?.image,
    lang: locale.value || 'ar',
    deviceType: 'web',
    deviceId: '2789',
  }
});

// check connection
socket.value.on('connect', () => {
  console.log('Connected to socket');
  console.log(user.value.id);
  console.log(user.value.name);
  console.log(user.value.image);
  
});

const uploaderMain = ref(null)
const receiver_id = ref(null)
const inputVal = ref(null)
const messagesArea = ref(null)
const textref = ref(null)
const messages = ref([])
const btnLoad = ref(false)
const imageSrc = ref(null)
const imageName = ref(null)
const fullFile = ref(null)
const fileType = ref(null)
const recieverData = ref({})


const pagination = ref({
  current_page: 1,
  next_page_url: null,
  total_pages: 1,
  loading: false,
});

const currentPage = ref(1);
const hasInitialMessagesHydrated = ref(false);

const applyRoomMessagesPayload = async (payload, append = false, previousHeight = 0) => {
  if (!payload) return;

  const newMessages = payload.messages?.data?.reverse?.() || [];

  if (append) {
    messages.value = [...newMessages, ...messages.value];
    await nextTick();
    const newHeight = messagesArea.value?.scrollHeight || 0;
    if (messagesArea.value) {
      messagesArea.value.scrollTop = newHeight - previousHeight;
    }
  } else {
    messages.value = newMessages;
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }

  recieverData.value = payload.members?.[0] || {};
  receiver_id.value = payload.members?.[0]?.id || null;
  currentPage.value = payload.messages?.pagination?.current_page || 1;
  pagination.value.total_pages = payload.messages?.pagination?.total_pages || 1;
};

watchEffect(async () => {
  if (hasInitialMessagesHydrated.value || !roomMessagesPayload.value) return;
  await applyRoomMessagesPayload(roomMessagesPayload.value, false);
  hasInitialMessagesHydrated.value = true;
});

const handleFile = (e) => {
  const file = e.target.files[0];
  imageSrc.value = URL.createObjectURL(file);
  imageName.value = file.name;
  fullFile.value = file;
  const type = file.type.split('/')[0];
  if (type == 'image') fileType.value = 'image';
  else fileType.value = 'file';
}

const removeFile = () => {
  imageSrc.value = null;
  imageName.value = null;
  fullFile.value = null;
  fileType.value = null;
//   uploaderMain.value.value = null;
}


function sendMessageTosocket(body, type) {
  socket.value.emit("send-message", {
    room_id: route.query.id,
    receiver_id: receiver_id.value,
    receiver_type: 'provider',
    type: type,
    body: body,
  });
}

// send Image
const sendImage = async () => {
    try {
        btnLoad.value = true;
        const fd = new FormData();
        fd.append('file', fullFile.value);
        fd.append('type', fileType.value);

        const res = await axios.post(`upload-room-file/${route.query.id}`, fd, config.value);

        if (response(res) == 'success') {
            sendMessageTosocket(res.data.data.file_name, fileType.value);
            removeFile();
            scrollToBottom();
        }

    } catch (err) {
        console.log(err);
        toastNotify('error', t('messages.error_happened'), err.response?.data?.msg || err.message);
    } finally {
        btnLoad.value = false;
    }
}

const sendMessage = async () => {
  if (inputVal.value) {
    sendMessageTosocket(inputVal.value, 'text');
  }
  if (fullFile.value) {
    sendImage();
  }
  inputVal.value = '';
//   uploaderMain.value.value = null;
  setTimeout(() => {
    scrollToBottom();
  }, 100);
};

function scrollToBottom() {
  const el = messagesArea.value;
  if (el) el.scrollBy(0, 100000);
  
}

const handleScroll = () => {
  const el = messagesArea.value;
  if (!el || pagination.value.loading) return;

  if (el.scrollTop < 5 && currentPage.value < pagination.value.total_pages) {
    const nextPage = currentPage.value + 1;
    getRoomMessages(nextPage, true);
  }
};

function newline() {
  inputVal.value += '\n';
}


import { nextTick } from 'vue';

// get Room Messages
const getRoomMessages = async (page = 1, append = false) => {
    try {
        pagination.value.loading = true;

        let previousHeight = 0;
        if (append && messagesArea.value) {
            previousHeight = messagesArea.value.scrollHeight;
        }

        if (page === 1 && !append) {
            await refreshRoomMessages();
            await applyRoomMessagesPayload(roomMessagesPayload.value, false);
            return;
        }

        const res = await axios.get(`general/get-room-messages/${route.query.id}?page=${page}`, config.value);

        if (response(res) == 'success') {
            const newMessages = res.data.data.messages?.data.reverse();

            if (append) {
                messages.value = [...newMessages, ...messages.value];

                // ✅ بعد ما Vue يرندر الرسائل، نرجّع scroll يدويًا
                await nextTick();
                const newHeight = messagesArea.value.scrollHeight;
                messagesArea.value.scrollTop = newHeight - previousHeight;
            } else {
                messages.value = newMessages;

                // أول مرة فقط نروح تحت
                setTimeout(() => {
                    scrollToBottom();
                }, 100);
            }

            recieverData.value = res.data.data.members[0];
            receiver_id.value = res.data.data.members[0]?.id;
            currentPage.value = res.data.data.messages.pagination.current_page;
            pagination.value.total_pages = res.data.data.messages.pagination.total_pages;
        }

    } catch (err) {
        console.log(err);
    } finally {
        pagination.value.loading = false;
    }
}



socket.value.on('message-received', function (data) {
console.log(locale.value);
  // moment.locale('ar')
 // format data before push
 data.created_at = moment(data.created_at).locale(locale.value).format('h:mm A');

  messages.value.push(data);
  console.log('message-received', data);
  
  setTimeout(() => {
    scrollToBottom();
  }, 0.1);
});

onMounted(() => {
  socket.value.emit("enter-chat", {
    room_id: route.query.id,
  });

  setTimeout(() => {
    scrollToBottom();
  }, 1500);

  if (messagesArea.value) {
    messagesArea.value.addEventListener("scroll", handleScroll);
  }
});

scrollToBottom();

onUnmounted(() => {
  // emit exit-chat
  socket.value.emit("exit-chat", {
    room_id: route.query.id,
  });
  if (messagesArea.value) {
    messagesArea.value.removeEventListener("scroll", handleScroll);
  }
});
</script>

<style scoped lang="scss">
/* ضيف ستايلاتك هنا */
</style>
