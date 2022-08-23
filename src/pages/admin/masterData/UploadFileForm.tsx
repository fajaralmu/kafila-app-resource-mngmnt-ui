import React, { ChangeEvent, FormEvent, useState } from 'react';
import ActionButton from '../../../components/buttons/ActionButton';

const UploadFileForm = (props: { submit: (file: File) => any }) => {
  const [file, setFile] = useState<any>(null);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (file && file instanceof File) {
      props.submit(file);
    }
  };
  const onChange = (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      setFile(input.files[0]);
    }
  }
  return (
    <form onSubmit={onSubmit}>
      <p>Select file</p>
      <input required onChange={onChange} className="form-control" type="file" accept="image/png" />
      <p></p>
      <ActionButton className="btn btn-success" type="submit">Upload</ActionButton>
    </form>
  );
};

export default UploadFileForm;