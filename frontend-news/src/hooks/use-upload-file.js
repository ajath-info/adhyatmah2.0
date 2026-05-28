import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import * as api from 'src/services'; // assuming you export uploadFile from here

export const useUploadSingleFile = (onSuccess, onError) => {
  const { cloudName, uploadPreset } = useSelector((state) => state.settings);
  return useMutation({
    mutationFn: ({ file, config }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      return api.uploadFile(formData, config, cloudName);
    },

    onSuccess: (data, variables, context) => {
      // ✅ pass correctly
      onSuccess(data, variables, context);
    },
    onError
  });
};
export const useUploadMultiFiles = (onSuccess, onError) => {
  const { cloudName, uploadPreset } = useSelector((state) => state.settings);
  return useMutation({
    mutationFn: async ({ files }) => {
      const uploads = files.map((file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        return api.uploadFile(formData, '', cloudName);
      });
      return Promise.all(uploads);
    },
    onSuccess: (results, variables) => {
      onSuccess(results, variables); // 👈 pass both
    },
    onError
  });
};
