export const useFormValidation = () => {
  
  const isFormValid = (formData, validations, imageUploaderRef = null) => {
    // فحص الحقول العادية
    const fieldsValid = Object.keys(validations).every(field => {
        try { 
            validations[field].validateSync(formData[field]); 
            return true; 
        } catch { 
            return false; 
        }
    });
    
    // فحص الـ dropdowns بس لو موجودين في الـ formData
    let dropdownsValid = true;
    if (formData.hasOwnProperty('defaultSection') && formData.hasOwnProperty('defaultSection2')) {
        dropdownsValid = formData.defaultSection && formData.defaultSection2;
    }
    
    // فحص الـ image uploader لو موجود
    let imageValid = true;
    if (imageUploaderRef && imageUploaderRef.value) {
        imageValid = imageUploaderRef.value.validate();
    }
    
    return fieldsValid && dropdownsValid && imageValid;
  };

  // دالة لإعادة تعيين الفورم
  const resetForm = (formData, showValidation = null) => {
    Object.keys(formData).forEach(key => {
      formData[key] = null;
    });
    
    // إعادة تعيين حالة الـ validation إذا تم تمريرها
    if (showValidation !== null) {
      showValidation.value = false;
    }
  };

  // Helper function للـ scroll
  const scrollToElement = (element, shouldFocus = false) => {
    if (!element) return false;
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    if (shouldFocus) element.focus();
    return true;
  };

  // دالة للعثور على أول عنصر غير صالح والتمرير إليه
  const scrollToFirstError = (formData, validations, imageUploaderRef = null) => {
    // فحص الـ image uploader أولاً (بدون إعادة validation، بس نشوف لو الصورة موجودة)
    if (imageUploaderRef && imageUploaderRef.value) {
      const uploadedImages = imageUploaderRef.value.uploadedImages || [];
      if (uploadedImages.length === 0) {
        const imageUploaderElement = document.querySelector('.single-input-upload');
        if (scrollToElement(imageUploaderElement)) {
          return 'imageUploader';
        }
      }
    }

    // فحص الحقول العادية
    for (const field of Object.keys(validations)) {
      try {
        validations[field].validateSync(formData[field]);
      } catch {
        // إذا وجد خطأ، ابحث عن العنصر وتمرر إليه
        const element = document.querySelector(`input[name="${field}"], select[name="${field}"], textarea[name="${field}"]`);
        if (scrollToElement(element, true)) {
          return field;
        }
      }
    }

    // فحص الـ dropdowns
    if (!formData.defaultSection) {
      const element = document.querySelector('.dropdown_card');
      if (scrollToElement(element)) {
        return 'defaultSection';
      }
    }

    if (!formData.defaultSection2) {
      const elements = document.querySelectorAll('.dropdown_card');
      if (scrollToElement(elements[1])) {
        return 'defaultSection2';
      }
    }

    return null; // لا توجد أخطاء
  };

  return {
    isFormValid,
    resetForm,
    scrollToFirstError
  };
};
