<template>
  <input
    v-if="!readOnly && (!maxFiles || uploadedImages.length < maxFiles)"
    :class="IsMultible ? 'multiple-input' : 'single-input'"
    type="file"
    :multiple="IsMultible"
    ref="deleteVal"
    :name="name"
    :accept="acceptedFiles"
    @change="handleFileChange" />
  <div :class="IsMultible ? 'multiple-images' : 'single-image'">
    <TransitionGroup name="image-list" tag="div" class="images-container">
      <div
        class="uploaded-block" v-for="(image, index) in uploadedImages"
        :key="image.url">
        <img
          v-if="acceptedFiles == 'image/*' || image.file.type.startsWith('image/')"
          :src="image.url"
        />
        <div class="file-block" v-else-if="image.file.type.startsWith('application/')">
          <font-awesome-icon :icon="['fas', 'file']" />
          <p class="file-name">{{ image.file.name }}</p>
        </div>
        <button type="button" class="remove-btn" @click="removeImage(index)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>

export default {

  props: ['acceptedFiles', 'name', 'IsMultible', "customProp", "newImages", "readOnly", "resetTrigger", "maxFiles"],
data() {
  return {
    uploadedImages: [],
  //   acceptedFiles: "application/*",
  };
},

methods: {
  handleFileChange(event) {
    if(this.readOnly) return;
    let selectedFiles = event.target.files;

    if (this.validateImageSize(selectedFiles)) {
      if(this.IsMultible) {
        const remaining = this.maxFiles ? this.maxFiles - this.uploadedImages.length : selectedFiles.length;
        for (let i = 0; i < Math.min(selectedFiles.length, remaining); i++) {
          const file = selectedFiles[i];
          const imageUrl = URL.createObjectURL(file);
          this.uploadedImages.push({ url: imageUrl, file });
        }
        // Emit array of files for multiple images
        this.$emit("uploaded-images-updated", this.uploadedImages.map(img => img.file));
      } else {
        const file = selectedFiles[0];
        const imageUrl = URL.createObjectURL(file);
        this.uploadedImages = [{ url: imageUrl, file }];
        // Emit single file for single image
        this.$emit("uploaded-images-updated", this.uploadedImages[0].file);
      }
    } else {
      console.log('Image size exceeds the maximum limit');
    }
    event.target.value = null;
  },

  validateImageSize(files) {
    const maxSizeInBytes = 20 * 1024 * 1024; // 20MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSizeInBytes) {
        return false; // Image size exceeds the maximum limit
      }
    }

return true; // All images are within the size limit
},
  
removeImage(index) {
  const removed = this.uploadedImages[index];
  // أبعت للوالد ID الصورة المحذوفة (لو موجود)
  if (removed.id) {
    this.$emit('remove-image', removed.id);
  }
  // احذف الصورة من القائمة
  this.uploadedImages.splice(index, 1);
  // أبعت للأب array محدثة من File objects فقط
  const files = this.uploadedImages.map(i => i.file).filter(f => f);
  this.$emit('uploaded-images-updated', files);
}
},

mounted() {
  watchEffect(() => {
    if (this.newImages) {
      if (this.IsMultible && Array.isArray(this.newImages)) {
        // Handle multiple images
        this.uploadedImages = this.newImages.map(img => ({
          url: img.image || img.url || img,
          file: null,
          id: img.id || null
        }));
      } else {
        // Handle single image
        this.uploadedImages = [{ 
          url: typeof this.newImages === 'object' ? (this.newImages.image || this.newImages.url) : this.newImages, 
          file: null,
          id: typeof this.newImages === 'object' ? this.newImages.id : null
        }];
      }
    }
  });
},

watch: {
  resetTrigger() {
    // Reset uploaded images when resetTrigger changes
    this.uploadedImages = [];
    this.$emit("uploaded-images-updated", []);
  }
},

};

</script>

<style lang="scss">
.input_auth {
    width: 130px;
    height: 130px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #E21876;
    border-radius: 50%;
    position: relative;
    input[type="file"] {
      width: 100%;
      height: 100%;
      position: absolute;
      opacity: 0;
      overflow: hidden;
      cursor: pointer;
    }
    .uploaded-block {
      position: absolute;
      margin: 0;
      // left: 0;
      // top: 0;
      // width: 100%;
      // height: 100%;
      left: 50%;
      top: 50%;
      width: 95%;
      height: 95%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
}

.multiple-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  
  .images-container {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
  }

  .uploaded-block {
    position: relative;
    width: 70px;
    height: 70px;
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.3s ease;
    will-change: transform, opacity;
    display: flex;
    align-items: center;
    justify-content: center;
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: hsl(0deg 1% 21% / 25%);
      transition: opacity 0.3s ease;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .file-name {
      font-size: 11px;
    }
  }

  .file-block {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    word-break: break-all;
    padding: 10px;
  }

  .remove-btn {
    position: absolute;
    transform: none !important;
    top: 2px;
    left: 2px !important;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--main);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1) !important;
    }
  }
}

// Transition animations
.image-list-move, 
.image-list-enter-active,
.image-list-leave-active {
  transition: all 0.3s ease;
}

.image-list-enter-from {
  opacity: 0;
  transform: scale(0.6);
}

.image-list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.image-list-leave-active {
  position: absolute;
  width: 100px;
  height: 100px;
}

.multiple-input {
  width: 100%;
  height: 45px;
  left: 0;
  top: 0;
  position: absolute;
  opacity: 0;
  overflow: hidden;
  cursor: pointer;
}

</style>
